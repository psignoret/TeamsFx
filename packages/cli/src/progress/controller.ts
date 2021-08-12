// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import chalk from "chalk";
import { MultiBar, SingleBar } from "cli-progress";

import Instance from "./instance";

export default class Controller {
  public static instance?: Controller;

  public static getInstance() {
    if (!Controller.instance) {
      Controller.instance = new Controller();
    }
    return Controller.instance;
  }

  private readonly controller: MultiBar;
  private readonly terminal: any;
  private progresses: Instance[];
  private _activeNum = 0;
  private needToRemove: [SingleBar, number, string][] = [];

  private timer?: NodeJS.Timeout;
  public readonly fps = 25;
  private pausedTimes = 0;

  get activeNum() {
    return this._activeNum;
  }

  get runningChar() {
    const chars = ["|", "/", "-", "\\"];
    return chars[Math.floor(Date.now() / 1000) % 4];
  }

  private constructor() {
    this.controller = new MultiBar({
      format: chalk.whiteBright("{bar}  {percentage}% {runningChar} {message}"),
      stopOnComplete: true,
      hideCursor: true,
      forceRedraw: true,
      barsize: 20,
      fps: this.fps,
      stream: process.stdout,
      barCompleteChar: "█",
      barIncompleteChar: "▒",
    });
    this.terminal = (this.controller as any).terminal;
    this.progresses = [];
  }

  public register(progress: Instance) {
    this.progresses.push(progress);
  }

  public start() {
    this.update();
  }

  public pause() {
    this.pausedTimes++;
    if (this.pausedTimes === 1) {
      (this.controller as any).isActive = true;
      if ((this.controller as any).timer) {
        clearTimeout((this.controller as any).timer);
        (this.controller as any).timer = null;
        this.clean();
      }
      (this.terminal as any).cursor(true);
    }
  }

  public continue() {
    if (this.pausedTimes === 0) {
      return;
    }
    this.pausedTimes--;
    if (this.pausedTimes === 0) {
      if (this._activeNum === 0) {
        (this.controller as any).isActive = false;
      }
      if (this._activeNum === 0 && this.needToRemove.length > 0) {
        this.end(true);
      } else if (this._activeNum > 0) {
        (this.terminal as any).cursor(false);
        (this.controller as any).update();
      }
    }
  }

  public end(success: boolean) {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
    this.progresses.forEach((progress) => {
      progress.end(success);
    });
    this.controller.stop();
    (this.controller as any).bars = [];
    this.needToRemove = [];
    (this.terminal as any).dy = 0;
    this.clean();
  }

  public update() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }

    if (this._activeNum > 0) {
      this.progresses.forEach((progress) => {
        const payload = { message: progress.message, runningChar: this.runningChar };
        progress.bar?.update(progress.percentage, payload);
      });
    }

    this.timer = setTimeout(this.update.bind(this), 1000 / this.fps);
  }

  public create(total: number, startValue: number, message: string): SingleBar {
    if (this._activeNum === 0) {
      this.start();
    }
    this._activeNum++;
    const payload = { message, runningChar: this.runningChar };
    return this.controller.create(total, startValue, payload);
  }

  public remove(bar: SingleBar, percentage: number, message: string) {
    const payload = { message, runningChar: "|" };
    bar.update(percentage, payload);
    this.needToRemove.push([bar, percentage, message]);
    this._activeNum--;
    if (this._activeNum === 0 && this.pausedTimes === 0) {
      this.end(true);
    }
    return;
  }

  public clean() {
    this.terminal.cursorRelativeReset();
    this.terminal.clearBottom();
  }
}
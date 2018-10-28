import * as async from "async";
import { ErrorCallback } from "../types";
import { each } from "bluebird";
import * as Knex from "knex";
import { logger } from "../utils/logger";
import * as _ from "lodash";

interface LogQueue {
  [blockHash: string]: Array<LogProcessCallback>;
}

export type LogProcessCallback = (db: Knex) => Promise<void>;

export const processQueue = async.queue((processFunction: (callback: ErrorCallback) => void, nextFunction: ErrorCallback): void => {
  processFunction(nextFunction);
}, 1);

const logQueue: LogQueue = {};

export function logQueueAdd(blockHash: string, logCallback: LogProcessCallback|Array<LogProcessCallback>) {
  if (logQueue[blockHash] === undefined) {
    logQueue[blockHash] = [];
  }
  if (Array.isArray(logCallback)) {
    logQueue[blockHash] = logQueue[blockHash].concat(logCallback);
  } else {
    logQueue[blockHash].push(logCallback);
  }
}

export function logQueuePop(blockHash: string): Array<LogProcessCallback> {
  if (logQueue[blockHash] === undefined) return [];
  const callbacks = logQueue[blockHash];
  delete logQueue[blockHash];
  return callbacks;
}

export function logQueueProcess(blockHash: string): (db: Knex) => Promise<void>  {
  const dbWritePromises = logQueuePop(blockHash);
  const remainingCallbacksByBlock = _.mapValues(logQueue, (callbacks) => callbacks.length);
  if (!_.isEmpty(remainingCallbacksByBlock)) console.log("Future Callbacks", remainingCallbacksByBlock);
  if (dbWritePromises.length > 0) logger.info(`Processing ${dbWritePromises.length} logs`);
  return async (db: Knex) => {
    for (const dbWritePromise of dbWritePromises) {
      await dbWritePromise(db);
    }
  };
}

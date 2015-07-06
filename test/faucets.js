#!/usr/bin/env node

"use strict";

var assert = require("chai").assert;
var chalk = require("chalk");
var Augur = require("../augur");
var log = console.log;

Augur = require("./utilities").setup(Augur, process.argv.slice(2));

log("Faucets:");

Augur.reputationFaucet(
    Augur.branches.dev,
    function (r) {
        // sent
    },
    function (r) {
        // success
        log(chalk.green("  ✓ ") + chalk.gray("Reputation faucet"));
    },
    function (r) {
        // failed
        if (r.message) {
            throw r.message;
        } else {
            throw r;
        }
    }
);

if (Augur.bignum(Augur.getCashBalance(Augur.coinbase)).toNumber() === 0) {
    Augur.cashFaucet(
        function (r) {
            // sent
        },
        function (r) {
            // success
            log(chalk.green("  ✓ ") + chalk.gray("Cash faucet"));
        },
        function (r) {
            // failed
            if (r.message) {
                throw r.message;
            } else {
                throw r;
            }
        }
    );
}

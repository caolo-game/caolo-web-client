#!/usr/bin/env node
// from https://github.com/netlify/next-on-netlify/blob/main/next-on-netlify.js

const { program } = require("commander");

const nextOnNetlify = require("./index");

program.option(
  "--max-log-lines [number]",
  "lines of build output to show for each section",
  50
);

program
  .command("watch")
  .description("re-runs next-on-netlify on changes")
  .action(() => {
    nextOnNetlify({ watch: true });
  });

program
  .command("build", { isDefault: true })
  .description("runs next-on-netlify")
  .action(() => {
    nextOnNetlify();
  });

program.parse(process.argv);

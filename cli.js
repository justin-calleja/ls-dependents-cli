#!/usr/bin/env node

var meow = require('meow');
var pkgDependents = require('pkg-dependents');
var pkgJSONInfoDict = require('pkg-json-info-dict').pkgJSONInfoDict;
var archify = require('archify').default;
var archy = require('archy');
var childrenOf = require('./childrenOf');

const cli = meow(`
    Usage:
        $ ls-dependents <package-name> [options]
          OR:
        $ ls-dependents [options] -- <package-name>
          i.e. use -- to separate <package-name> so it won't be picked up
          as the value of any option e.g. -r

    ls-dependents is used to list packages using <package-name> as a
    dependency/peerDependency/devDependency.
    Searching is done on the file system. You need to add paths in which
    to search for dependents using the -a option.
    Each directory in each given path will be searched for a package.json
    file which will then be checked for the use of <package-name> in any of its
    peer/dev/dependencies.

    If <package-name> is not given, the recursive tree of each package's dependents is printed out.

    Options:
        -h, --help            print usage information
        -v, --version         show version info and exit
        -a, --add <path>      add path in which to search for dependents
                 (defaults to current working directory if no -a is given)
        -r, --recurse         repeat the operation on each found dependent
                 and print the output as a tree
`, {
  alias: {
    v: 'version',
    h: 'help',
    a: 'add',
    r: 'recurse'
  }
});

var pkgName = cli.input[0];

var paths = undefined;
if (Array.isArray(cli.flags.add)) {
  paths = cli.flags.add;
} else if (cli.flags.add !== undefined){
  paths = [cli.flags.add];
} else {
  paths = [process.cwd()];
}

var recurse = cli.flags.r || false;

pkgJSONInfoDict(paths, (err, result) => {
  if (!pkgName) {
    var allDependentsDict = pkgDependents.allDependentsOf(result);
    Object.keys(allDependentsDict).forEach(key => {
      console.log(archy(archify(key, allDependentsDict, childrenOf)));
    });
  } else if (recurse) {
    var filteredDependentsDict = pkgDependents.filter(pkgName, pkgDependents.allDependentsOf(result));
    console.log(archy(archify(pkgName, filteredDependentsDict, childrenOf)));
  } else {
    var dependentsDict = pkgDependents.dependentsOfDict(pkgName, result);
    console.log(archy(archify(pkgName, dependentsDict, childrenOf)));
  }
});

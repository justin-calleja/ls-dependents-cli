// parent: string
// data: DependentsDict
module.exports = function childrenOf(parent, data) {
  var dependents = data[parent];
  if (dependents === undefined) {
    return [];
  } else {
    var depsLP = Object.keys(dependents.dependencyDependents).map(key => ({
      label: key,
      suffix: ` has a dependency on ${parent} version ${dependents.dependencyDependents[key].pkgJSON.dependencies[parent]}`
    }));
    var peerDepsLP = Object.keys(dependents.peerDependencyDependents).map(key => ({
      label: key,
      suffix: ` has a peerDependency on ${parent} version ${dependents.peerDependencyDependents[key].pkgJSON.peerDependencies[parent]}`
    }));
    var devDepsLP = Object.keys(dependents.devDependencyDependents).map(key => ({
      label: key,
      suffix: ` has a devDependency on ${parent} version ${dependents.devDependencyDependents[key].pkgJSON.devDependencies[parent]}`
    }));

    return depsLP.concat(peerDepsLP).concat(devDepsLP);
  }
}

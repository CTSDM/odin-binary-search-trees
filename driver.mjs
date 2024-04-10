import { Tree } from './tree.mjs'

// initialize variables
const N = 10; // number of node of our tree
const arr = populateRandomArr(N)
const tree = new Tree(arr);
prettyPrint(tree.root);
console.log(`Is the tree balanced? ${tree.isBalanced()}`);
console.log('Level print ///');
console.log(tree.levelOrderIterative());
console.log('///');
console.log('Pre order print ///');
console.log(tree.preOrder());
console.log('///');
console.log('Post order print ///');
console.log(tree.postOrder());
console.log('///');
console.log('In order print ///');
console.log(tree.inOrder());
console.log('///');

// Unbalance tree
console.log('Adding values to unbalance tree...')
tree.insert(101);
tree.insert(111);
tree.insert(121);
tree.insert(131);
console.log(`Is the tree balanced? ${tree.isBalanced()}`);
prettyPrint(tree.root);
console.log('Rebalancing the tree...')
tree.rebalance();
console.log(`Is the tree balanced? ${tree.isBalanced()}`);
prettyPrint(tree.root);
console.log('Level print ///');
console.log(tree.levelOrderIterative());
console.log('///');
console.log('Pre order print ///');
console.log(tree.preOrder());
console.log('///');
console.log('Post order print ///');
console.log(tree.postOrder());
console.log('///');
console.log('In order print ///');
console.log(tree.inOrder());
console.log('///');
function populateRandomArr(n) {
    // the function returns an array of length
    // The elements are random but >= and <100 and they are integers
    // The elements can be repeated
    const arr = [];
    for (let i = 0; i < n; ++i) {
        let randomNumber = Math.floor(Math.random() * 100);
        arr.push(randomNumber);
    }
    return arr;
}

// function provided by the odin assignment
function prettyPrint(node, prefix = "", isLeft = true) {
    if (node === null) {
        return;
    }
    if (node.right !== null) {
        prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
        prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
};

import { Node } from "./node.mjs";
import { mergeSort } from "./mergeSort.mjs";
export { Tree }

class Tree {
    constructor(arr) {
        this.root = this.buildTree(arr);
    }

    buildTree(arr) {
        // Takes an array and if necessary sorts it, and eliminates duplicates.
        // It then creates a balanced binary tree full of Node objects and 
        // it returns the level-0 root node.

        let arrTree = arr.slice();
        mergeSort(arrTree);
        this.#removeDuplicates(arrTree);
        return this.#balanceTree(arrTree, 0, arrTree.length - 1);
    }

    #balanceTree(arr, left, right) {
        if (left <= right) {
            let mid = Math.floor((right + left) / 2);
            let node = new Node(arr[mid]);
            node.left = this.#balanceTree(arr, left, mid - 1);
            node.right = this.#balanceTree(arr, mid + 1, right);
            return node;
        }
        return null;
    }

    insert(value, node = this.root) {
        // We assume that there might not be even exist a root node
        if (node === null) {
            this.root = new Node(value);
        }
        if (value > node.data) {
            if (node.right === null)
                node.right = new Node(value);
            else
                this.insert(value, node.right);
        }
        else if (value < node.data) {
            if (node.left === null)
                node.left = new Node(value);
            else
                this.insert(value, node.left);
        }
        return;
    }

    deleteItem(value, node = this.root, parentNode = undefined) {
        // We look for the value, if it is found we remove it.
        // Otherwise we do nothing.
        // If the node containing the value is a leaf (null right and left child)
        // we remove its pointer from the parent, so it now points to null.
        // Otherwise, we apply the following logic:
        // We look for the node that is on its right, and then from that node we search
        // for the node that is on the most left position

        if (node === null)
            return;
        if (node.data > value)
            this.deleteItem(value, node.left, node);
        else if (node.data < value)
            this.deleteItem(value, node.right, node);
        else {
            const rightChild = node.right;
            // the item to be deleted is a leaf
            if (rightChild === null && node.left === null) {
                if (parentNode === undefined)
                    this.root = null;
                else {
                    if (parentNode.left) {
                        if (parentNode.left.data === value)
                            parentNode.left = null;
                    }
                    else
                        parentNode.right = null;
                }
            }
            else if (rightChild === null) {
                node.data = node.left.data;
                node.right = node.left.right;
                node.left = node.left.left;
            } else if (rightChild.left === null) {
                node.data = rightChild.data;
                node.right = rightChild.right;
            } else {
                // let's find the most left child and its parent
                let pair = this.#getPair(rightChild, rightChild.left);
                node.data = pair[1].data;
                pair[0].left = pair[1].right;
            }
        }
        return;
    }

    find(value, node = this.root) {
        if (node !== null) {
            if (node.data === value)
                return node;
            else if (node.data > value)
                return this.find(value, node.left);
            else
                return this.find(value, node.right);
        }
        return null;
    }

    levelOrderRecursive(callback) {
        const arrNodes = [];
        recursiveHelper(callback);
        if (!callback)
            return arrNodes;

        function recursiveHelper(arrQueue = [this.root], callback) {
            if (arrQueue[0] === null)
                return null;
            if (arrQueue.length > 0) {
                if (arrQueue[0].left !== null)
                    arrQueue.push(arrQueue[0].left);
                if (arrQueue[0].right !== null)
                    arrQueue.push(arrQueue[0].right);
                if (callback)
                    callback(arrQueue.shift());
                else
                    arrNodes.push(arrQueue.shift().data);
                this.levelOrderRecursive(callback, arrQueue);
            }
        }
    }

    levelOrderIterative(callback) {
        const arrNodes = [];
        const arrQueue = [this.root]
        if (arrQueue[0] === null)
            return null;
        while (arrQueue.length > 0) {
            if (arrQueue[0].left !== null)
                arrQueue.push(arrQueue[0].left);
            if (arrQueue[0].right !== null)
                arrQueue.push(arrQueue[0].right);
            if (callback)
                callback(arrQueue.shift());
            else
                arrNodes.push(arrQueue.shift().data);
        }

        if (!callback)
            return arrNodes;
    }

    inOrder(callback) {
        const arrNodes = [];
        inOrderRecursive(callback, this.root);
        if (!callback)
            return arrNodes

        // helper recursive function to traverse the binary tree in order
        function inOrderRecursive(callback, node) {
            if (node === null)
                return;

            inOrderRecursive(callback, node.left);
            // the callback might be not defined
            if (callback === undefined)
                arrNodes.push(node.data);
            else
                callback(node);
            inOrderRecursive(callback, node.right);
        }
    }

    preOrder(callback) {
        const arrNodes = [];
        preOrderRecursive(callback, this.root);
        if (!callback)
            return arrNodes;

        // helper recursive function to traverse the binary tree in preorder
        function preOrderRecursive(callback, node) {
            if (node === null)
                return
            if (callback === undefined)
                arrNodes.push(node.data)
            else
                callback(node);
            preOrderRecursive(callback, node.left);
            preOrderRecursive(callback, node.right);
        }
    }

    postOrder(callback) {
        const arrNodes = [];
        postOrder(callback, this.root);
        if (!callback)
            return arrNodes;

        function postOrder(callback, node) {
            if (node === null)
                return;
            postOrder(callback, node.left);
            postOrder(callback, node.right);
            if (callback === undefined)
                arrNodes.push(node.data);
            else
                callback(node);
        }
    }

    height(node) {
        // height: the number of edges in the longest path from a given node to a leaf node
        // Implementation done recursively.
        // We assume that the give node is either invalid or is member of the BST.
        if (node === null)
            return -1
        if (node.data === undefined)
            throw new Error('the given node is not a valid Node.');
        if (node.left === null && node.right === null)
            return 0;
        let right = node.right ? this.height(node.right) : 0;
        let left = node.left ? this.height(node.left) : 0;

        return (left > right) ? left + 1 : right + 1;
    }

    depth(node, auxNode = this.root) {
        // depth: the number of edges in the path from a given node to the tree's root node
        // We will implement it in a similar fashion the find method
        if (node.data === undefined)
            throw new Error('the given node is not a valid Node.');
        if (node.data === auxNode.data)
            return 0;
        if (node.data > auxNode.data)
            return this.depth(node, auxNode.right) + 1;
        if (node.data < auxNode.data)
            return this.depth(node, auxNode.left) + 1;
    }

    isBalanced() {
        // A balanced tree is one where the difference between heights of
        // the left subtree and the right subtree of every node is not more than 1.
        // For heights < 3 the tree is always balanced
        if (this.height(this.root) < 3)
            return true;

        return isBalancedRecursiveHelper.call(this, this.root);
        // we proceed recursively with a helper function
        function isBalancedRecursiveHelper(node) {
            if (node === null)
                return true;
            if (Math.abs(this.height(node.left) - this.height(node.right)) > 1)
                return false;
            if (!isBalancedRecursiveHelper.call(this, node.left))
                return false;
            if (!isBalancedRecursiveHelper.call(this, node.right))
                return false;

            return true;
        }
    }

    rebalance() {
        if (this.isBalanced())
            return;
        const arrInOrder = this.inOrder();
        this.root = this.#balanceTree(arrInOrder, 0, arrInOrder.length - 1);
    }

    // This method is used to find recursively the most left child
    // it is implemented outside of the deleteItem method to save memory
    // since the deleteItem is also called recursively.
    #getPair(node, leftChild) {
        if (leftChild.left === null)
            return [node, leftChild];
        return this.#getPair(leftChild, leftChild.left);
    }

    #removeDuplicates(arr) {
        // Because the array is ordered and composed by numbers we can apply a first difference
        // The first difference generates a sequence whose length is 1 less than the original
        let arrFirstDifference = [];
        for (let i = 0; i < arr.length - 1; ++i)
            arrFirstDifference[i] = arr[i + 1] - arr[i];
        // the values that are different from zero correspond no non duplicate values
        // The first value of the original arrary will always be on the generated array
        // because is the first element, it is never removed

        // We keep track of how many different elements are inside the array
        let k = 0;
        for (let i = 0; i < arrFirstDifference.length; ++i) {
            if (arrFirstDifference[i] > 0) {
                ++k;
                arr[k] = arr[i + 1];
            }
        }
        // We remove the end values
        arr.splice(k + 1);
    }
}


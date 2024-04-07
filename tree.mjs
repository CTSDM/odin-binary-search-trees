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
                node.left = node.left.left;
                node.right = node.left.right;
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


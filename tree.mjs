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


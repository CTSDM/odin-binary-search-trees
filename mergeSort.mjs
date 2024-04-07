export { mergeSort }

function mergeSort(arr) {
    let n = arr.length;
    if (n <= 1)
        return arr;

    mergeRecursive(arr, 0, n - 1);

    function mergeRecursive(arr, left, right) {
        if (left < right) {
            let mid = Math.floor((right + left) / 2);
            mergeRecursive(arr, left, mid);
            mergeRecursive(arr, mid + 1, right);
            mergeInsertion(arr, left, mid + 1, right);
        }
    }

    function mergeInsertion(arr, left, mid, right) {
        // We create the portions of the array we are sorting
        // We create a shallow copy of the main array
        const leftArr = arr.slice(left, mid);
        const rightArr = arr.slice(mid, right + 1);
        // We loop the total length of the sum of both arrays
        for (let i = 0, j = 0, k = left; k <= right; ++k) {
            if ((rightArr[j] < leftArr[i] && j <= (right - mid)) || i >= (mid - left)) {
                arr[k] = rightArr[j];
                ++j;
            } else {
                arr[k] = leftArr[i];
                ++i;
            }
        }
    }
}

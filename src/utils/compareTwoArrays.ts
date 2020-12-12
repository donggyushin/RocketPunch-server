const compareTwoArray = (array1: string[], array2: string[]) => {
  const array2Sorted = array2.slice().sort();
  return (
    array1.length === array2.length &&
    array1
      .slice()
      .sort()
      .every(function (value, index) {
        return value === array2Sorted[index];
      })
  );
};

export default compareTwoArray;

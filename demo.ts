const promiseFunc = async (array: Promise<any>[]) => {
  const res = await Promise.allSettled(array);

  const count = res.reduce((count, ele) => {
    if (ele.status === 'fulfilled') {
      count++;
    }
    return count;
  }, 0);

  return { count: count, fail: res.length - count };
};

promiseFunc([Promise.resolve(1), Promise.reject(2), Promise.resolve(3)]).then((data) => {
  console.log(data);
});

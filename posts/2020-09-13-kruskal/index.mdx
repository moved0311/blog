---
title: Kruslal's Minimum Spanning Tree
date: 2020-09-13
tags:
  - Algorithms
  - Tree
---

## Minimum Spanning Tree (最小生成樹)

- 所有節點都要連通，且邊的權重總和最低。
- 邊的數量為節點數-1

## Kruskal's Algorithms

步驟：

1. 將所有邊依照權重(weight)做排序
2. 將邊依序由權重小至大加入到圖中，若加入的邊產生迴圈(cycle)則丟棄。
3. 重複步驟 2，直到圖中的邊數為節點數-1

#### 檢查是否產生迴圈

可以使用[Union-Find Algorithm](https://www.geeksforgeeks.org/union-find-algorithm-set-2-union-by-rank/?ref=lbp)。所有節點用一個 subset 來紀錄節點是否有共同的 parent，若有共同 parent 代表兩個節點是同一個集合(連通的)。

```js
const find = (subset, i) => {
  if (subset[i] === -1) {
    return i;
  }
  return find(subset, subset[i]);
};
const union = (subset, x, y) => {
  let xset = find(subset, x);
  let yset = find(subset, y);
  subset[xset] = yset;
};
```

```js
let subset = Array(points.length).fill(-1);

for (let i = 0, numOfEdge = 0; ; i++) {
  const { weight, src, dist } = edges[i];
  let x = find(subset, src);
  let y = find(subset, dist);
  //...
}
```

subset 每個 index 表示節點的號碼，初始值設為-1，搜尋到-1 就會結束 find(),並回傳節點 index。
將邊(src, dist)的 src, dist 節點分別帶入 find()，若 x 與 y 相同表示 x 與 y 是同一個集合(產生迴圈)。
若產生迴圈則捨棄這個邊，若沒有產生迴圈則執行 union()將邊加入圖中，並更新 subset。

## JavaScript Implementation:

```js
const find = (subset, i) => {
  if (subset[i] === -1) {
    return i;
  }
  return find(subset, subset[i]);
};
const union = (subset, x, y) => {
  let xset = find(subset, x);
  let yset = find(subset, y);
  subset[xset] = yset;
};

/**
 * @param {number[][]} points
 * @return {number}
 */
var kruskal = function (points) {
  if (points.length <= 1) return 0;

  let edges = []; //  [{weight: 1, src: 0, dist: 1}, ....]
  points.map((point1, src) => {
    points.map((point2, dist) => {
      let manhattan = Math.abs(point1[0] - point2[0]) + Math.abs(point1[1] - point2[1]);
      if (src !== dist) edges.push({ weight: manhattan, src: src, dist: dist });
    });
  });
  edges.sort((e1, e2) => e1.weight - e2.weight); //sorted edges.
  console.log(edges);

  let subset = Array(points.length).fill(-1);
  let cost = 0;

  for (let i = 0, numOfEdge = 0; ; i++) {
    const { weight, src, dist } = edges[i];

    let x = find(subset, src);
    let y = find(subset, dist);

    if (x === y) {
      console.log("Add Edge:", src, " --> ", dist, "(has cycle)");
    }

    if (x !== y) {
      console.log("Add Edge:", src, " --> ", dist);
      union(subset, x, y);
      cost += weight;
      numOfEdge += 1;
      console.log("subset:", subset);
    }
    if (numOfEdge >= points.length - 1) break; // if there are v -1 edges ---> fininsh.
  }
  return cost;
};
```

## Reference

- [1584. Min Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points/)
- [Kruskal’s Minimum Spanning Tree Algorithm | Greedy Algo-2](https://www.geeksforgeeks.org/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/)

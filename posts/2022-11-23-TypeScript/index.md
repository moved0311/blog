---
title: "TypeScript"
date: "2022-11-25"
tags:
  - TypeScript
lastUpdate: 2023-01-18
---

## React 元件範例

```jsx
const Header = ({ title }: { title: string }) => {
  return <h1>{title}</h1>;
};

<Header title="Hello" />;
```

```jsx
const Header = ({ children }: { children: ReactNode }): ReactElement => {
  return <h1>{children}</h1>;
};

/* const fn = (a: a參數型態): fn回傳型態 => {} */

<Header>
  <strong>Hello</strong>
</Header>;
```

- 參考
  - [[YouTube] Typescript for React Components From Beginners to Masters](https://www.youtube.com/watch?v=z8lDwLKthr8&list=WL&index=1)

### 常見的 React Type

- FC\
  常見於 Component 回傳型態, `FC<T>`定義 Component 回傳型態為`FC<T>`,是一個 FC(Function Component)可接受一個 T 型態的 Props。

```ts
import type { FC } from 'react'
const MyComponent: FC<Props> => (props: Props) => {
      /* ... */
}
```

- CSSProperties\
  當傳遞 style 做為 Properties 可以使用 CSSProperties 做為 style 的 type

```ts
import type { CSSProperties } from "react";
```

## types 邏輯運算

### AND OR

```ts
type AType = {
  a: number;
};

type BType = {
  b: number;
};

type CType = AType & BType;
// { a: number, b: nubmer }

type DType = AType | BType;
// { a: number } or { b: number }
```

### IF

在 Typescript 中用 extends 關鍵字來表示分支(if...else)

```ts
If<true, "a", "b">; // 'a'
If<false, "a", "b">; // 'b'

type If<C, T, F> = C extends true ? T : F;
// C是否是true,是的情況返回T, 否則返回F
```

## Utility Types

### Record

```ts
enum CATEGORY {
  A = "a",
  B = "b",
  C = "c",
}

type ContentAll = Record<CATEGORY, string>;
// {a :string, b: string, c: string}
```

### Pick

```ts
enum CATEGORY {
  A = "a",
  B = "b",
  C = "c",
}

type ContentPick = Pick<ContentAll, CATEGORY.A | CATEGORY.C>;
// {a: string, c: string}
```

- Picker 實作

  ```ts
  type MyPick<T, K extends keyof T> = {
    [P in K]: T[P];
  };

  /*
      Todo = {
        title: string
        completed: string
      }
      keyof Todo -> "title" | "completed"
  */
  ```

### Omit

`Omit<Type, Keys>`, 將 Type 中的 Keys 排除

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

type TodoInfo = Omit<Todo, "completed" | "createdAt">;
// { title: string, description: string }
```

### Readonly

`Readonly<T>`,將 type T 設定成唯讀屬性

```ts
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};
```

### PropertyKey

PropertyKey 保留字,等同 string | number | symbol

### Infer

依靠 TypeScript 來判斷型態，必須使用在 extends 之後\
extends 是 Typescript 中分支的功能像是 if...else

```ts
type Title<T> = T extends string ? string : unknown;
```

- Infer 範例: 回傳 Array 第一筆元素型態

```ts
type First<T extends any[]> = T extends [infer U, ...any[]] ? U : never;
```

### Exclude

Exclude<T, U> 在 T 中，但不在 U 中

```ts
type Exclude<T, U> = T extends U ? never : T;

/*
  never是所有Type的子集合
  type a = string | never // string

  Exclude<"a" | "b" | "c", "c"> -> "a", "b"
  "a" extends "c" -> "a"
  "b" extends "c" -> "b"
  "c" extends "c" -> never
*/
```

### Awaited

Promise 處理完後的返回型態

```ts
type X = Promise<string>;

Awaited<X>; // string
```

```ts
type Awaited<T> = T extends Promise<infer R> ? (R extends Promise<unknown> ? Awaited<R> : R) : never;
/*
  先判斷T是不是Prmoise不是回傳never
  判斷Promise裡面是不是還有Promise,是的話遞迴處理,否則回傳T
*/
```

- 參考
  - [type-challenges](https://github.com/type-challenges/type-challenges)
  - [TypeScript: Documentation - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

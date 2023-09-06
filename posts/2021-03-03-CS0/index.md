---
title: "CS50"
date: 2021-03-03
---

# Portal

- [edX CS50's Introduction to Computer Science](https://learning.edx.org/course/course-v1:HarvardX+CS50+X/home#block-v1:HarvardX+CS50+X+type@chapter+block@6f03d24800094666b5e522412d707ad7)
- [cs50 中文討論區](https://www.facebook.com/groups/556507217856457/)
- [fackbook groups CS50](https://www.facebook.com/groups/cs50)
- [CS50 IDE](https://ide.cs50.io/)
- [CS50 Docs](https://cs50.readthedocs.io/sandbox/)
- [CS50 Github](https://github.com/cs50)

# Week 0 : Scratch

介紹什麼是電腦科學？電腦科學根本上是在探討怎麼解決問題(problem-solving)。要解決問題首先定義問題(input)，和要有什麼結果(output)，input 和 output 中間的過程就是電腦科學在探討的事情。

## 二進制, 資料表示

之後介紹了二進制(Binary)，二進制是電腦唯一看得懂的語言，也就是一連串 0 和 1 組合而成的東西。
那我們要怎麼將我們看的懂的字表示成電腦看得懂的二進制的型態呢？就要了解到 ACSII 碼，ASCII 定義了字元對應到的二進制的資料，例如 A 對應到 65 (1000001)。

## 演算法

演算法是 input 與 output 中間的黑盒子，黑盒子的內容是一個步驟一個步驟定義明確的動作。

其中一個例子是要在電話簿上找到 Mike Smith 的電話號碼。問題的 input 就是整本電話簿，output 是 Mike Smith 的電話號碼。下面列了一些辦法：

- 第一種方法:一頁一頁翻
  ```
  1. 拿起電話簿
  2. 打開第一頁
  3. 查看這頁
  4. if Mike Smith在這頁
  5.   打給Mike Smith
  6. else
  7.   翻到下一頁,並到步驟3
  ```
- 第二種方法: 一次翻兩頁
  > 比第一個方法快，但是可能會略過
- 第三種方法: 從中間開始翻，再根據字典排序查詢左半邊或右半邊，不斷的重複直到找到名字或是翻完電話簿

---

# Week 1: C

```c
#include <stdio.h>
int main(void){
	printf("hello world");
}
```

#### compiler clang

```
clang hello.c
clang -o hello hello.c
```

#### command

```
ls
rm
mkdir
```

#### get user name

```c
#include <cs50.h>
#include <stdio.h>

int main(void)
{
    string name = get_string("What's your name?\n");
    printf("hello, %s\n", name);
}
```

#### 程式編譯成機器語言(Machine code)步驟

- Preprocessing
- Compiling
- Assembling
- Linking

#### Segmentation fault

> When a program tries to access memory that it shouldn't

---

# Week 3: Algorithm

- #### Selection sort
  | time complexity |               |
  | --------------- | ------------- |
  | Upperbound      | $O(n^2)$      |
  | Lowerbound      | $\Omega(n^2)$ |
  |                 | $\Theta(n^2)$ |
- #### Bubble sort

| time complexity |             |
| --------------- | ----------- |
| Upperbound      | $O(n^2)$    |
| Lowerbound      | $\Omega(n)$ |

- #### Recursion
- #### Merge sort
  | time complexity |                    |
  | --------------- | ------------------ |
  | Upperbound      | $O(n\log(n))$      |
  | Lowerbound      | $\Omega(n\log(n))$ |
  |                 | $\Theta(n\log(n))$ |

---

# Week 4

## dexadecimal

## address

- & address
  變數在記憶體中的位置

```c
 int n = 50
 printf("%i\n", &n)  // 0x12345678
```

- \* (go to that address)

```c
 int n = 50
 printf("%i\n", *&n)  // 50
```

## pointer

```c
 int n = 50
 int *p = &n
 printf("%p\n", p)  // 0x12345678
```

```c
 int n = 50
 int *p = &n
 printf("%i\n", *p)  // 50
```

![](https://i.imgur.com/J3qQBI8.png)

## String

C 沒有 string 這個 type，但是可以自己定義 string

```c
type char *string
```

`string`和`char *`是等價的。

```c=
string s = "Hi!"
```

實際存在記憶體是![](https://i.imgur.com/w111i6w.png)
只需要記得字串的起始位置，在字串結束會自動補上`\0`代表字串結束

## malloc

宣告記憶體後，記得要 free()

## Swap

```c
int main(){
	int x = 1, y = 2;
	printf("x is %i, y is %i\n", x, y);
	swap(x, y);
	printf("x is %i, y is %i\n", x, y);
}
void swap(int a, int b){
	int tmp = a;
	a = b;
	b = tmp;
}
// results:
// x is 1, y is 2
// x is 1, y is 2
```

在記憶體中,swap()的變數 a,b 會另外存在一個新的記憶體位置中。當 swap()執行完畢，a 是 2,b 是 1。但是並不會改變到原來記憶體中的值 x,y。所以必須要透過指標來修改 x,y 的值。

```c
int main(){
	int x = 1, y = 2;
	printf("x is %i, y is %i\n", x, y);
	swap(&x, &y);
	printf("x is %i, y is %i\n", x, y);
}
void swap(int *a, int *b){
	int tmp = *a;
	*a = *b;
	*b = tmp;
}
// results:
// x is 1, y is 2
// x is 2, y is 1
```

## FILEIO

---

# Week5: Data Structure

## Linked lists

```c
typedef struct node
{
	int number;
	struct node *next;
}
node;
```

```c
#include <stdio.h>

typedef struct node
{
	int number;
	struct node *next;
}
node;

int main(void){
	node *list = NULL;
	node *n  = malloc(sizeof(node))
	if(n == NULL){
		return 1;
	}
	n->number = 1;
	n->next = NULL;
	list = n;

	n = malloc(sizeof(node));
	if(n == NULL){
		free(list)
		return 1;
	}
	n->number = 2;
	n->next = NULL;
	list->next = n;

	n = malloc(sizeof(node));
	if(n == NULL){
		free(list->next)
		free(list)
		return 1;
	}
	n->number = 3;
	n->next = NULL;
	list->next->next = n;

	for(node *tmp = list; tmp != NULL; tmp = tmp->next){
		printf("%i/n", tmp->number);
	}

	while(list != NULL){
		node *tmp = list -> next;
		free(list);
		list = tmp;
	}
}
```

## Tree

## hash tables

> array of linked list

- hash function
- collision

## Tries

> array of tree

> allow for constant-time lookup for words in a dictionary.

## Queue

> FIFO(First In First Out)

- enqueue
- dequeue

## Stacks

> LIFO(Last In First Out)

- push
- pop

## Dictionary

# Week6 Python

```python
while True:
	print("hello world.")
```

```python
for i in [0,1,2]:
	print("hello world")

for i in range(3):
	print("hello world")

```

```python
ans = input("What's your name? ")
print(f"Hello {ans}")
```

```python
def main():
		meow(3)

def meow(n):
	for i in range(n):
		print("meow")

main()
```

```python
for i in range(4):
	print("?", end="") # end default is "\n"
print()

# ????
```

- Swap

```python
x = 1
y = 2
x,y = y,x #swap
```

# Week7: SQL

- flat-file database
  - e.g. csv
- reational database

> flat-file 在找資料時需要花費 O(n)來找資料，對於大量資料來說很浪費。

```python
import csv

with open("stock_20210214.csv", "r") as file:
    reader = csv.DictReader(file)
    for row in reader:
        print(row['證券代號'], row['證券名稱'])

# 0050 元大台灣50
# 0051 元大中型100
# 0052 富邦科技
# 0053 元大電子
# 0054 元大台商50
```

## SQLite

```bash
pip3 install pysqlite3
```

```bash
.mode csv
.import 'xxx.csv' <tableName>
.schema
```

```sql
SELECT columns FROM table;

--模糊搜尋
SELECT title FROM shows WHERE title LIKE "%Office%"

--相同的資料合併，並計算數量
SELECT UPPER(title), COUNT(title) FROM shows GROUP BY UPPER(title);
```

在 csv 中存資料可能是

| title   | genres                |
| ------- | --------------------- |
| Friends | Comedy, Music, Action |

但存在資料庫不希望一格欄位裡存多筆資料，要另外處理","問題。
所以在建立 table 時需要做正規化。將一大張表格拆成多個表格。

#### shows

| id  | genres  |
| --- | ------- |
| 1   | Friends |

#### genres

| show_id | genres |
| ------- | ------ |
| 1       | Comedy |
| 1       | Music  |
| 1       | Action |

```python
import csv
from cs50 import SQL

open("show.db", "w").close() # create empty file.
db = SQL("sqlite:///shows.db")

db.execute("CREATE TABLE shows (id INTERGER, title TEXT, PRIMARY KEY(id))")
db.execute("CREATE TABLE genres (show_id) INTERGER, genres TEXT, FOREIGN KEY(show_id) REFERENCES shows(id)")

with open("xxx.csv", "r") as file:
	reader = csv.DictReader(file)
	for row in reader:
		title = row["title"].strip().upper()
		# sql用?來插入變數
		id = db.execute("INSERT INTO shows (title) VALUES(?)", title)
		for genre in row["genres"].split(", "):
			db.execute("INSERT INTO genres (show_id, genre) VALUES(?, ?)", id, genre)
```

```bash
sqlite3 shows.db

.schema
```

## sql 資料型態

```
BLOB
INTERGER
NUMERIC
REAL
TEXT
```

## indexs

為 table 建立 index，來加速搜尋

## JOIN

```sql
SELECT title FROM people
JOIN stars ON people.id = stars.person_id
JOIN shows ON stars.show_id = show.id
WHERE name = "Steve Carell";
```

## SQL injection

## Race condition

> When two things happen at the same time and produce an unexpected result

發生在很多使用者同時操作資料庫時會發生問題。例如使用者 A,B 同時對一張照片按讚，A 會先執行查詢照片按讚的數量(100)，B 也執行相同的 SQL 也拿到 100，那在執行 UPDATE 時就會出錯。

> 在執行 SQL 時需要先使用 transation，來鎖住資料庫阻止其他 SQL 存取，當執行完畢時才解開鎖，這樣在查詢時就不會在同時間拿到相同的值。

# Week8: Web Programming

## Network

> a network of network
>
> 用 cable 或是 wireless 將所有裝置連結起來的網路

- TCP/IP
  - TCP
    處理 port 與封包遺失問題
- DNS
- HTTP

## HTML

- http-server

## CSS

## JavaScript

# Security

# Week9: Flask

實做：用 flask 來接受使用者註冊的範例和使用程式來操作 gmail 寄註冊成功的信

> 當要把使用者信箱或是密碼嵌入在程式碼內，最好是存在 local 變數，然後用程式來存取，例如 python 的 OS library, 可以防止將敏感資料直接寫在程式碼中

# Artificial Intelligence

## Minimax Algorithm

針對兩位玩家(X,Y)的遊戲，例如:tic-tac-toe。
玩家 X 考慮所有的可能，並為每一種可能計算分數，假設遊戲結果只會有三種可能：X 贏用 1 表示、平手用 0 表示、X 輸用-1 表示。那 X 就必須想辦法每一步都挑選分數最高的結果，Y 則必須每一步都挑選分數最低的結果。

```
if player is X:
	for all possible moves:
		calculate score for board
	choose move with highest score
else:
	for all possible moves:
		calculate score for board
	choose move with lowest score
```

## Search Algorithm

- Depth-First Search
- Breadth-First Search
- Uninformed Search
  - 加入 heuristic 來判斷要選擇哪個方向
    若 A 點要到 B 點，途中會需要判斷要先到 C 點或 D 點，使用 heuristic 來判斷，heuristic 是一種估計方法，可以使用曼哈頓距離(Manhattan distance or Manhattan length)或其他方法來計算 C 和 D 分別到 B 的距離來決定要先往 C 或 D 點移動。
- Greedy Breadth-First Search
  - 加入 heuristic 的 BFS
- A\* Search
  - 改良 Greedy Breadth-First Search，並在 heuristic 多計算步驟數，原本只單純考慮距離目標的距離，A\*的計算方式為(距離+步驟數)

## Machine Learning

- Reinforcement Learning
  - 將每次錯誤記下來，避免下次再發生一樣的錯誤
- Gentic Algorithms

# Week10: Ethics

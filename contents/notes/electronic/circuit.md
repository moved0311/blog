---
title: 電路學
date: 2026-08-21
category: note
---
[電路學開放式課程 - YouTube](https://www.youtube.com/playlist?list=PL68D2uCy1WTMtp1m5TEJbKEt4kvlA4jLP)

[單元 1．電路學課程導論 - YouTube](https://www.youtube.com/watch?v=vupQZd8bm8M)
KCL, KVL, 節點電壓法, 網路電流法

[單元 2．基本電路觀念：電路變數的定義 - YouTube](https://www.youtube.com/watch?v=EAK3GX2I85s)

電路學的三個假設:
1. 忽略時間延遲
	- 假設有完美的短路，實際上考慮時間延遲，沒有辦法保證短路上處處電壓相等
2. 導線沒有輻射損耗(能量損耗)
	- KVL有一個前提假設是能量守恆，但實際上會有能量損耗
3. 所有元件都是線性元件
	- 電阻是線性的，VI關係圖是一條直線，實際上會是曲線

Current:
$i = \frac{dq}{dt}$

Voltage:
$v = \frac{dw}{dq}$

[單元 3．基本電路觀念：元件模型 - YouTube](https://www.youtube.com/watch?v=KzmuQfhxoa8)

$$p = \frac{dw}{dt} = \frac{dw}{dq} \times \frac{dq}{dt} = vi$$
計算功率定義電流都由+ → - (Passive sign convention)
- P > 0 : 消耗功率(被動元件)
- P < 0: 提供功率(主動元件)

了解各元件IV關係圖:
- 獨立電壓源(圓圈)
- 獨立電流源(圓圈)
- 相依電壓源(菱形)
- 相依電流源(菱形)

要計算元件的功率，只需要知道電壓和電流(P = IV)，而不同的元件I和V之間會有關係，例如電阻的話V=IR。需要了解電阻(R)、電容(C)、電感(L)之間IV的轉換關係。

|     | R      | C                                                    | L                                                   |
| --- | ------ | ---------------------------------------------------- | --------------------------------------------------- |
| v   | v=Ri   | v(t) = $V(0) + \frac{1}{C}\int_{0}^{t}i(\tau) d\tau$ | $v(t) = L\frac{di(t)}{dt}$                          |
| i   | i = Gv | $i(t) = C\frac{dv(t)}{dt}$                           | $i(t) =i(0) + \frac{1}{L}\int_{0}^{t} v(\tau)d\tau$ |
## Resistor 電阻
- R=$\rho\frac{l}{A}$
	- $\rho$: 電阻率 resistivity
	- l: 導體長度
	- A:導體面積
- R: resistance(ohms, $\Omega$)
- G: conductance(siemens, S)
	- $\sigma$: 導電率 conductivity
## Capacitor 電容

結構: 兩個金屬板中間填充絕緣體

當電壓越大，金屬板的電荷數量越高  Q $\propto$ V

Q = CV,  C = $\epsilon \frac{A}{d}$
- $\epsilon$ : permittivity 電容率 (F/m)
- $\epsilon_{0}: 8.85 \times 10^{-12}$ F/m
- $\epsilon$ = $\epsilon_{r} \times \epsilon_{0}$
	- $\epsilon_{r}$ 介電常數 relative permittivity
	- 表示是真空電容率的幾倍

當電壓隨時間改變V(t)，絕緣體內產生位移電流(displacement current)

Q(t) = C V(t)

$i(t) = \frac{dQ(t)}{dt} = C\frac{dv(t)}{dt}$

$\frac{dv(t)}{dt} = \frac{1}{C}i(t)$

$\int_{-\infty}^{t} \frac{dv(t)}{dt} dt = \int_{-\infty}^{t} \frac{1}{C}i(t) dt$

$\int_{-\infty}^{t} \frac{dv(\tau)}{dt} d\tau = \int_{-\infty}^{t} \frac{1}{C}i(\tau) d\tau$

V(t) = $\frac{1}{C}\int_{-\infty}^{0}i(\tau) d\tau + \frac{1}{C}\int_{0}^{t}i(\tau) d\tau$ = $V(0) + \frac{1}{C}\int_{0}^{t}i(\tau) d\tau$

## Inductor 電感

磁通量: $N\phi \propto i$, N:線圈匝數

$N\phi = L \times i$, $L = \mu \times N^2 \times \frac{A}{l}$
- $\mu$: 導磁率(H/m)
- $\mu_0: 4\pi \times 10^{-7}$ H/m

$v(t) = \frac{dN\phi}{dt} = L\frac{di(t)}{dt}$

磁場變化產生感應電壓(induced voltage)

$\frac{di(t)}{dt} = \frac{1}{L} v(t)$

$\int_{-\infty}^{t} \frac{di(\tau)}{dt} d\tau = \frac{1}{L}\int_{-\infty}^{t} v(\tau)d\tau$

$i(t) = \frac{1}{L}\int_{-\infty}^{t} v(\tau)d\tau = \frac{1}{L}\int_{-\infty}^{0} v(\tau)d\tau + \frac{1}{L}\int_{0}^{t} v(\tau)d\tau = i(0)  + \frac{1}{L}\int_{0}^{t} v(\tau)d\tau$

$i(t) = i(0)  + \frac{1}{L}\int_{0}^{t} v(\tau)d\tau$

[單元 4．基本電路觀念：元件模型、KCL與KVL - YouTube](https://www.youtube.com/watch?v=yQHMJyqW0K4)
求解電路: 

2B
- KCL: N-1條算式
- KVL: M條算式
- Component Model: B條算式
加起來總共2B條算式

N節點數, B元件數, M 網目數\
M = B - (N-1)

## KCL: Kirchhoff's Current Law

流出節點的電流=流入節點的電流

## KVL: Kirchhoff's Voltage Law
迴圈內的 總壓升=總壓降


[單元 5．基本電路觀念 - 2B法 - YouTube](https://www.youtube.com/watch?v=p0OxaKE5Fv8)























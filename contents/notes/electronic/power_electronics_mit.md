---
title: MIT 6.622 Power Electronics, Spring 2023
category: note
date: 2026-08-29
---

## Lecture1

[Lecture 1: Introduction to Power Electronics - YouTube](https://www.youtube.com/watch?v=f7oXhDatwtY&list=PLUl4u3cNGP62UTc77mJoubhDELSC8lfR0)

12V 怎麼轉換成 5V ?

- 分壓(串一個可變電阻) → 簡單但是效率差
- PWM: 用一個開關控制開路斷路，在每個週期控制開與關的比例

pulse width modulation(PWM, 脈衝寬度調變)
pulsating voltage (脈動電壓)

## Lecture2

[Lecture 2: Analysis Methods and Rectifiers - YouTube](https://www.youtube.com/watch?v=bJ1nqEC3i0A&list=PLUl4u3cNGP62UTc77mJoubhDELSC8lfR0&index=4)

periodic steady state (PSS)
系統經過一段暫態後，每一個週期的波形都重複，此時就進入 PSS

- 剛開始電容充電，電壓一直改變，這段叫 **Transient（暫態）**。過了一段時間後，電壓固定下來，就是 **Steady State（穩態）**。

電容PSS

$$
\begin{aligned}
& v_c(t+T) = v_c(t)\quad\text{經過一個完整週期T後，儲存能量回到原本狀態}\\
& i_C=C\frac{dv_C}{d_t} \\
& d{v_c}= \frac{i_C}{C}d_t \\
& \Delta V_c=\frac{1}{C}\int_{0}^{T}i_C(t)dt\quad, \Delta V_c = 0\\
& \frac{1}{C}\int_{0}^{T}i_C(t)dt = 0\\
& I_{c,avg} = 0
\end{aligned}
$$

PSS狀態下，電容電流為0

電感PSS

$$
\begin{aligned}
& v_L=L\frac{di_L}{dt}\\
& di_L=\frac{v_L}{L}dt\\
& i_L(T)-i_L(0)=\frac{1}{L}\int_{0}^{T}v_L(t)dt\\
& i_L(T)=i_L(0)\\
& \int_{0}^{T}v_L(t)dt=0\\
& V_{L,avg}=0
\end{aligned}
$$

PSS狀態下電感一個週期平均電壓為0

解釋說AC轉DC時，如果只有一個二極體(Diode)會遇到什麼問題，以及會什麼會用到兩個二極體。

![[rectifiers_LR.png]]

![[rectifiers_LR2.png]]

Freewheeling Diode / Flyback Diode（續流二極體）

二極體

```
        Diode
A ──────>|────── K
Anode           Cathode
```

D = ON, $V_A > V_K$
D = OFF, $V_A<V_K$

到負半週期，$V_s$變成負值，D1從ON變OFF，D2 Forward Bias (D2 ON)

為什麼半波整流器（Half-Wave Rectifier）的平均輸出電壓$V_{avg}=\frac{V_s}{\pi}$

$$
V_s(\theta)=V_s\sin\theta
$$

$$
v_o(\theta)=
\begin{cases}
V_{s}\sin\theta,&0\le\theta\le\pi \newline
0,&\pi\le\theta\le2\pi
\end{cases}
$$

$$
\begin{aligned}
V_{avg}&=\frac{1}{2\pi}\int_{0}^{2\pi}v_0(\theta)d\theta \newline
V_{avg}&=\frac{v_s}{2\pi}\int_{0}^{\pi}\sin\theta d\theta \newline &= \frac{V_s}{2\pi}\times2 = \frac{v_s}{\pi}
\end{aligned}
$$

## [Lecture 3: Load Regulation - YouTube](https://www.youtube.com/watch?v=Tpc39Bv3YJ8&list=PLUl4u3cNGP62UTc77mJoubhDELSC8lfR0&index=3)

Commutation Inductance（換流電感）

![[rectifiers_LR3.png]]

如果沒有加$L_c$  電流可以瞬間 D2→Ｄ1
但有Lc的話，會同時有一段時間D1=ON, D2=ON
D2轉移到D1的過程稱作Commutation

Commutating Angle (u)
$$
\begin{aligned}
L_c\frac{di_1}{dt}&=V_s\sin{\omega t}\\
i_1(t)&=\frac{V_s}{\omega L_c}(1-\cos{\omega t})\\
\omega t &= u \\
i_1 &= I_D\\
I_D &= \frac{V_s}{\omega L_c}(1-\cos{\omega u}) \\
\cos{u}&=1-\frac{\omega L_c I_D}{V_s}
\end{aligned}
$$

Load Regulation（負載調整率）
當負載電流改變時，電源能不能維持輸出電壓穩定

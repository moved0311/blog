---
title: Embedded Systems
category: note
date: 2026-11-04
lastUpdate: 2026-11-16
---

課程: [Udemy-Embedded-Systems-Bare-Metal-Programming](https://www.udemy.com/course/embedded-systems-bare-metal-programming) \
板子: NUCLEO-F446RE

起始花費: NT\$850(板子) + NT\$370(Udemy)

文件:

- [reference manual](https://www.st.com/resource/en/reference_manual/rm0390-stm32f446xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf)
- [datasheet](https://www.st.com/resource/en/datasheet/stm32f446mc.pdf)
- [nucleo-user-guide](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf)

Source Code:

- [STM32 Bare-Metal Embedded-C – EmbeddedExpertIO](https://blog.embeddedexpert.io/stm32-bare-metal-embedded-c/)

## 1. Getting Started - Constructing Peripheral Registers from Memory Addresses

| 縮寫 |                                     |
| ---- | ----------------------------------- |
| APB  | Advanced Peripheral Bus             |
| AHP  | Advanced High-performance Bus       |
| RCC  | Reset and Clock Control             |
| ODR  | Output Data Register 輸出資料暫存器 |

ex1: 讓LED持續亮\
ex2: 讓LED閃爍

```c

/* Peripheral base address */
#define PERIPH_BASE         (0x40000000UL)

/* AHB1 and AHB2 offsets */
#define AHB1_OFFSET         (0x00020000UL)
#define AHB2_OFFSET         (0x10000000UL)

/* AHB base addresses */
#define AHB1_PERIPH_BASE    (PERIPH_BASE + AHB1_OFFSET)
#define AHB2_PERIPH_BASE    (PERIPH_BASE + AHB2_OFFSET)

/* RCC */
#define RCC_OFFSET          (0x00003800UL)
#define RCC_BASE            (AHB1_PERIPH_BASE + RCC_OFFSET)

/* GPIOA */
#define GPIOA_OFFSET        (0x00000000UL)
#define GPIOA_BASE          (AHB1_PERIPH_BASE + GPIOA_OFFSET)

/* RCC AHB1 clock enable register */
#define AHB1EN_R_OFFSET     (0x30UL)
#define RCC_AHB1EN_R        (*(volatile unsigned int *)(RCC_BASE + AHB1EN_R_OFFSET))

/* GPIOA mode register */
#define MODE_R_OFFSET       (0x00UL)
#define GPIOA_MODE_R        (*(volatile unsigned int *)(GPIOA_BASE + MODE_R_OFFSET))

/* GPIOA output data register */
#define OD_R_OFFSET         (0x14UL)
#define GPIOA_OD_R          (*(volatile unsigned int *)(GPIOA_BASE + OD_R_OFFSET))

/* Pin definitions */
#define PIN_5               (1U << 5)
#define LED_PIN             PIN_5

/* GPIOA clock enable */
#define GPIOAEN             (1U << 0)

int main(void)
{
    /* 1. Enable GPIOA clock */
    RCC_AHB1EN_R |= GPIOAEN;

    /* 2. Clear PA5 mode bits */
    GPIOA_MODE_R &= ~(3U << 10);

    /* 3. Set PA5 as output (01) */
    GPIOA_MODE_R |= (1U << 10);

    /* 4. Turn on LED */
    GPIOA_OD_R |= LED_PIN;

    while (1)
    {
		/* 5. Toggle LED */
		GPIOA_OD_R  ^=LED_PIN;
		for(int i=0;i<100000;i++){}
    }
}

```

STM32 使用 Memory-Mapped I/O（記憶體映射輸入輸出）。\
MCU 把 GPIO、RCC、USART、Timer 等硬體周邊的暫存器，映射到固定的記憶體位址

Mode Register（MODER）用來設定 GPIO 腳位的模式

透過struct簡化程式碼, 之後的引入header檔案也是用struct

```diff-c
#include <stdint.h>

#define PERIPH_BASE         (0x40000000UL)

#define AHB1PERIPH_OFFSET   (0x00020000UL)
#define AHB1PERIPH_BASE     (PERIPH_BASE + AHB1PERIPH_OFFSET)

#define GPIOA_OFFSET        (0x00000000UL)
#define GPIOA_BASE          (AHB1PERIPH_BASE + GPIOA_OFFSET)

#define RCC_OFFSET          (0x00003800UL)
#define RCC_BASE            (AHB1PERIPH_BASE + RCC_OFFSET)

#define PIN5                (1U << 5)
#define LED_PIN             PIN5

/* GPIOA clock enable */
#define GPIOAEN             (1U << 0)

+/* RCC register structure */
+typedef struct
+{
+    volatile uint32_t DUMMY[12];
+    volatile uint32_t AHB1ENR;
+} RCC_TypeDef;

+/* GPIO register structure */
+typedef struct
+{
+    volatile uint32_t MODER;
+    volatile uint32_t DUMMY[4];
+    volatile uint32_t ODR;
+} GPIO_TypeDef;

+/* Peripheral pointer definitions */
+#define RCC     ((RCC_TypeDef *)RCC_BASE)
+#define GPIOA   ((GPIO_TypeDef *)GPIOA_BASE)

 int main(void)
 {
     /* 1. Enable GPIOA clock */
-    RCC_AHB1EN_R |= GPIOAEN;
+    RCC->AHB1ENR |= GPIOAEN;

     /* 2. Set PA5 as output */
-    GPIOA_MODE_R &= ~(3U << 10);
-    GPIOA_MODE_R |= (1U << 10);
+    GPIOA->MODER |= (1U << 10);
+    GPIOA->MODER &= ~(1U << 11);

     while (1){
        /* Toggle PA5 */
        GPIOA->ODR ^= LED_PIN;
        for (int i = 0; i < 100000; i++){}
     }
 }

```

## 2. General Purpose Input/Output (GPIO)

PA1 = Port A Pin 1

#### Common Registers

- Direction Register: Set pin as input or output (MODE Register)
- Data Register: Write to pin or read from pin

#### Busese

- Advanced High-Performance Bus (AHB): 1 clock cycle access to peripherals
- Advanced Peripheral Bus (APB): Minimum of 2 clock cycles access to peripherals

#### Clock Sources

- On-Chip RC Oscillator: Least precise
- Externally Connected Crystal: Most precise
- Phase Locked Loop (PLL): Programmable

#### BSRR (Bit Set/Reset Rigister)

BSRR前16bits用來set，後16bits用來reset。\
第5個bit用來set PIN5，第21個bit用來reset PIN5，也可以做到閃爍的效果

```c
while(1){
    GPIOA->BSRR = LED_PIN;
    for(int i=0;i<100000;i++){}
    GPIOA->BSRR = (1U<<21);
    for(int i=0;i<100000;i++){}
}
```

#### Input Driver

ex4. 按下按鈕開關LED

| 周邊  | 匯流排 | RCC 暫存器    | Enable Bit |
| ----- | ------ | ------------- | ---------- |
| GPIOA | AHB1   | `RCC_AHB1ENR` | Bit 0      |
| GPIOB | AHB1   | `RCC_AHB1ENR` | Bit 1      |
| GPIOC | AHB1   | `RCC_AHB1ENR` | Bit 2      |

使用不同周邊要啟用不同clock

```c
RCC->AHB1ENR |= GPIOAEN;
RCC->AHB1ENR |= GPIOCEN;
```

設定LED為輸出，Button為輸入(用MODER設定)

```c
// Set PA5(LED) as output pin
GPIOA->MODER |= (1U<<10);
GPIOA->MODER &= ~(1U<<11);

// Set Push-buttons PC13 as input pin
// MODER13: 26,27 pin
// 00: input mode
GPIOC->MODER &=~(1U<<26);
GPIOC->MODER &=~(1U<<27);
```

檢查有沒有按按鈕

```c
if(GPIOC->IDR & BTN_PIN)
```

## 3. Universal Asynchronous Receiver-Transmitter(UART)

|              | Serial | Parallel |
| ------------ | ------ | -------- |
| Asynchronous | UART   |          |
| Synchronous  |        |          |

Serial: 一次傳1個bit\
Parallel: 一次傳8個bits

Synchronous: clock和data一起傳\
Asynchronous: 不用傳clock，但約定相同的clock speed (Baudrate)

Duplex: 可以傳送和接收資料\
Simplex: 只能傳送或接收資料\
Half Duplex: 同一個時間只能傳送或接收資料\
Full Duplex: 同一個時間可以同時傳送和接收資料

#### 初始化UART TX(傳送)

```c
#include "stm32f4xx.h"

#define GPIOAEN			(1U<<0)
#define UART2EN			(1U<<17)

#define SYS_FREQ		16000000
#define APB1_CLK		SYS_FREQ
#define UART_BAUDRATE	115200

#define CR1_TE			(1U<<3)
#define CR1_UE			(1U<<13)
#define SR_TXE			(1U<<7)

void uar2_tx_init(void)
{
	/****************Configure uart gpio pin***************/
	/* Enable clock access to gpioa */
	RCC->AHB1ENR |= GPIOAEN;

	/* Set PA2 mode to alternate function mode (10)
       datasheet: Table 9. Alternate function mapping
       USART2_TX: PA2 AF07
    */
	GPIOA->MODER &=~(1U<<4);
	GPIOA->MODER |= (1U<<5);

	/* Set PA2 alternate function type to UART_TX (AF07)
       AFR[0] (AFRL)   PA0-PA7
       AFR[1] (AFRH)  PA8-PA15
       PA2 的 Alternate Function 設定位於 AFR[0][11:8]
       設為0111 → AF7 USART2_TX
    */
	GPIOA->AFR[0] |= (1U<<8);
	GPIOA->AFR[0] |= (1U<<9);
	GPIOA->AFR[0] |= (1U<<10);
	GPIOA->AFR[0] &= ~(1U<<11);

	/****************Configure uart module ***************/
	/* Enable clock access to uart2  USART2EN: 17bit */
	RCC->APB1ENR |= UART2EN;

	/* Configure baudrate
       USART2從stm32f4xx.h定義
    */
	uart_set_baudrate(USART2, APB1_CLK, UART_BAUDRATE);

	/* Configure the transfer direction */
	 USART2->CR1 =  CR1_TE;

	/*Enable uart module*/
	 USART2->CR1 |= CR1_UE;
}
```

計算Buad Rate

```c
static void uart_set_baudrate(USART_TypeDef *USARTx, uint32_t PeriphClk,  uint32_t BaudRate){
	USARTx->BRR =  compute_uart_bd(PeriphClk,BaudRate);
}

/* BRR = (PeriphClk + BaudRate / 2) / BaudRate */
static uint16_t compute_uart_bd(uint32_t PeriphClk, uint32_t BaudRate){
	return ((PeriphClk + (BaudRate/2U))/BaudRate);
}
```

理論值是`PeriphClk / BaudRate`，加`BaudRate/2U` 是為了四捨五入

#### Status register(USART_SR)

Bit7 TXE: Transmit data register empty

```c
#define SR_TXE  (1U<<7)

int main(void){
	uar2_tx_init();
	while(1){
		uart2_write('Y');
	}
}

void uart2_write(int ch)
{
    /*Make sure the transmit data register is empty*/
    while(!(USART2->SR & SR_TXE)){}

    /*Write to transmit data register
        & 0xFF 限制在8bits
    */
	USART2->DR	=  (ch & 0xFF);
}
```

[RealTerm](https://sourceforge.net/projects/realterm/): 免費的 Windows 序列埠通訊軟體（Serial Terminal），主要用來接收、傳送、監控與分析 UART、RS-232、TCP 等通訊資料。

透過RealTerm觀察STM32持續送出的`Y`

#### printf

```c
int __io_putchar(int ch){
	uart2_write(ch);
	return ch;
}

int main(void){
	uar2_tx_init();
	while(1){
		printf("Hello from STM32F4........\n\r");
	}
}
```

`__io_putchar` 讓`printf()`進行UART輸出

UART同時讀和寫\
透過電腦的 RealTerm 傳送字元，控制開發板上的 LD2 LED

- 電腦傳送字元 '1' → LED 亮。
- 電腦傳送其他字元（例如 '0'）→ LED 滅。

```c
#define CR1_TE			(1U<<3)
#define CR1_RE			(1U<<2)
#define CR1_UE			(1U<<13)
#define SR_RXNE			(1U<<5)

void uart2_rxtx_init(void)
{
	/****************Configure uart gpio pin***************/
	/*Enable clock access to gpioa */
	RCC->AHB1ENR |= GPIOAEN;

	/*Set PA2 mode to alternate function mode*/
	GPIOA->MODER &=~(1U<<4);
	GPIOA->MODER |= (1U<<5);

	/*Set PA2 alternate function type to UART_TX (AF07)*/
	GPIOA->AFR[0] |= (1U<<8);
	GPIOA->AFR[0] |= (1U<<9);
	GPIOA->AFR[0] |= (1U<<10);
	GPIOA->AFR[0] &= ~(1U<<11);

	/*Set PA3 mode to alternate function mode*/
	GPIOA->MODER &=~(1U<<6);
	GPIOA->MODER |= (1U<<7);

	/*Set PA3 alternate function type to UART_RX (AF07)*/
	GPIOA->AFR[0] |= (1U<<12);
	GPIOA->AFR[0] |= (1U<<13);
	GPIOA->AFR[0] |= (1U<<14);
	GPIOA->AFR[0] &= ~(1U<<15);

	/****************Configure uart module ***************/
	/*Enable clock access to uart2 */
	RCC->APB1ENR |= UART2EN;

	/*Configure baudrate*/
	uart_set_baudrate(USART2,APB1_CLK,UART_BAUDRATE);

	/*Configure the transfer direction*/
	 USART2->CR1 =  (CR1_TE | CR1_RE);

	/*Enable uart module*/
	 USART2->CR1 |= CR1_UE;
}

char uart2_read(void)
{
    /*Make sure the receive data register is not empty*/
	while(!(USART2->SR & SR_RXNE)){}

	/*Read data*/
	return USART2->DR;
}
```

```c
#include <stdio.h>
#include <stdint.h>
#include "stm32f4xx.h"
#include "uart.h"
#define GPIOAEN     (1U<<0)
#define GPIOA_5     (1U<<5)
#define LED_PIN     GPIOA_5   //PA5: LD2 LED

char key;
int main(void){
	/*1.Enable clock access to GPIOA*/
	RCC->AHB1ENR |= GPIOAEN;

	/*2.Set PA5 as output pin
      MODER[11:10] = 01 → General Purpose Output
    */
	GPIOA->MODER |= (1U<<10);
	GPIOA->MODER &= ~(1U<<11);

	uart2_rxtx_init();

	while(1){
		key =  uart2_read();
		if(key == '1'){
			GPIOA->ODR |= LED_PIN;
		}else {
			GPIOA->ODR &= ~LED_PIN;
		}
	}
}
```

## 4. Analog to Digital Conversion(ADC)

溫度、速度等物理量通常是連續變化的類比量(Analog)，
CPU主要處理數位(Digital)資料，所以需要一個轉換器。

轉換器有不同的解析度依據支援的bits數，例如8bits可以表示256個級距。
參考電壓為5V的情況下，每一個級距約為5/256=19.531mV，
電壓在同一個級距內用相同的bits表示

下一個實驗是把PA1分別接到GND和3.3V觀察ADC轉成數位資料的數值，接到GND數值會很接近0，接到3.3V數值會接近2^12 (12bits)。

[11.12.11 ADC regular sequence register](/pdf/embedded/reference_manual.pdf#page=236)

```c
#define GPIOAEN		    (1U<<0)
#define ADC1EN			(1U<<8)
#define ADC_CH1			(1U<<0)
#define ADC_SEQ_LEN_1	 0x00
#define CR2_AD0N		(1U<<0)

void pa1_adc_init(void)
{
	/***Configure the ADC GPIO pin ***/
	/*Enable clock access to GPIOA*/
	RCC->AHB1ENR |= GPIOAEN;
	/*Set the mode of PA1 to analo
      11: Analog Mode */
	GPIOA->MODER |=(1U<<2);
	GPIOA->MODER |=(1U<<3);
	/***Configure the ADC module***/
	/*Enable clock access to ADC */
	RCC->APB2ENR |= ADC1EN;
	/*Conversion sequence start*/
	ADC1->SQR3 = ADC_CH1;
	/*Conversion sequence length 0000 -> 轉換1次*/
	ADC1->SQR1 = ADC_SEQ_LEN_1;
	/*Enable ADC module*/
	ADC1->CR2 |= CR2_AD0N;
}
```

[11.12.3 ADC control register 2 (ADC_CR2)](/pdf/embedded/reference_manual.pdf#page=231) \
SWSTART: bit 30

```c
#define CR2_SWSTART		(1U<<30)
#define SR_EOC			(1U<<1)

void start_converstion(void){
	/*Start adc conversion*/
	ADC1->CR2 |= CR2_SWSTART;
}

uint32_t adc_read(void){
	/*Wait for conversion to be complete*/
	while(!(ADC1->SR & SR_EOC)){}

	/*Read converted result*/
	return (ADC1->DR);
}
```

開啟continuous conversion，會持續做ADC。如果只有打開CR2_SWSTART會做一次就停下來

```diff c
+ #define CR2_CONT		(1U<<1)

void start_converstion(void){
+	/*Enable continuous conversion*/
+	ADC1->CR2 |= CR2_CONT;
	/*Start adc conversion*/
	ADC1->CR2 |= CR2_SWSTART;
}
```

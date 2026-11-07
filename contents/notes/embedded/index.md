---
title: Embedded Systems
category: note
date: 2026-11-04
lastUpdate: 2026-11-04
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

透過struct簡化程式碼

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

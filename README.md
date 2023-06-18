# 🔹 Heap-Tracker

<p align="center">
<img src="https://github.com/CODEBLUE3/HeapTracker-client/assets/62285847/a1641542-256a-4673-b966-cf6c2af41103" width="400"/>
</p>

- `Heap-Tracker`는 유저가 입력한 자바스크립트 코드의 힙 메모리 사용량을 차트로 시각화한 웹 어플리케이션입니다.
- 최대, 최소 힙 메모리 사용량 및 런타임 시간 등 여러 정보를 차트와 함께 제공합니다.

<br/>


# Preview

| 기본 화면                                                                                                         | 메모리 측정 후 차트 표현 화면                                                                                                                                                                             |
| ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
|  <img width="1556" alt="스크린샷 2023-06-18 오후 6 00 18" src="https://github.com/CODEBLUE3/HeapTracker-client/assets/52302090/d9435827-d561-4272-9ab1-0bf02683b0d5"> | <img width="1556" alt="스크린샷 2023-06-18 오후 6 03 25" src="https://github.com/CODEBLUE3/HeapTracker-client/assets/52302090/7b42b9f5-a2c2-4d03-bb11-eaff44cfde27"> |

<br>

# 🔹 Features

- 메모리 측정을 위한 사용자 코드를 **함수 코드**에 입력합니다.
- **함수 실행 코드**에 작성한 함수에 매개변수를 추가하여 입력합니다.
- **실행** 버튼을 눌러 코드를 실행합니다.
- 코드가 실행되면 아래 **실행 결과**창에 결과가 출력됩니다. 실행 오류가 난다면 **빨간글씨**로 출력됩니다.
- 코드 실행이 완료되었으면 측정된 메모리의 기본 정보들(**함수실행 시간, 사용된 메모리, 측정 객체의 갯수**)이 우측에 출력됩니다.
- 기본값으로 **bytes, ns(nano seconds)**설정값을 Chart Result의 토클 버튼을 통해 **Kilo bytes, ms(micro seconds)**로 변경할 수 있습니다.
- 기본값으로 Memory Line Chart가 선택되어있는 차트 아래의 **시작, 일시정지, 정지버튼**으로 차트를 동적 애니메이션으로 동작합니다.
- 차트의 요소에 마우스 포인터를 가져가 해당 요소의 **세부 정보를 확인**할 수 있습니다.
- 차트 우측 상단의 컬러 팔레트를 도구를 통해 **차트 Liner과 bar의 색을 변경**할 수 있습니다.
- 중앙 상단의 컬러테마 콤보박스 컨트롤을 통해 **애플리케이션의 Color Theme를 변경**할 수있습니다.
<br>

# 🔹 Motivation

내가 풀이한 알고리즘의 메모리 사용량을 정밀하게 측정해보면 어떨까?라는 생각으로 프로젝트를 출발하게 되었습니다.

<br/>

# Table of Contents

- [Motivation](#-🔹-motivation)
- [Features](#-🔹-features)
- [Challenges](#-🔹-challenges)
  - [1. 라이브러리를 사용하지 않고 메모리 사용량 측정하기](#1-라이브러리를-사용하지-않고-메모리-사용량-측정하기)
    - [1-1. 메모리 측정 방법 선택](#1-1-메모리-측정-방법-선택)
    - [1-2. V8엔진에서 이야기하는 메모리란](#1-2-v8엔진에서-이야기하는-메모리란)
    - [1-3. 메모리 측정 기준, AST 선택](#1-3-메모리-측정-기준-ast-선택)
    - [1-4. Heap 메모리 사용량을 측정을 위한 memory tracking 함수 제작](#1-4-heap-메모리-사용량을-측정을-위한-memory-tracking-함수-제작)
  - [2. 라이브러리를 사용하지 않고 React에서 동적 차트 구현하기](#2-라이브러리를-사용하지-않고-react에서-동적-차트-구현하기)
    - [2-1. Canvas.API로 차트 그리기](#2-1-canvasapi로-차트-그리기)
    - [2-2. Class를 사용한 차트 추상화 시도](#2-2-class를-사용한-차트-추상화-시도)
    - [2-3. Canvas API를 활용하기 위한 useCanvas() 커스텀 훅을 만들었다면 어땠을까?](<#2-3-Canvas-api를-활용하기-위한-useCanvas()-커스텀-훅을-만들었다면-어땠을까?>)
    - [커스텀 훅은 컴포넌트간에 로직 공유가 자유롭습니다](#커스텀-훅은-컴포넌트간에-로직-공유가-자유롭습니다)
    - [useRef()리액트 훅으로 <canvas> 요소에 접근하기](<#useref()리액트-훅으로-canvas-요소에-접근하기>)
    - [useChart() 커스텀 훅을 만들어 재사용성 높이기](#usechart-커스텀-훅을-만들어-재사용성-높이기)
- [Schedule](#-🔹-schedule)
- [Tech Stacks](#-🔹-tech-stacks)
- [Member](#-🔹-member)

<br>

# 🔹 Callenges

<br/>

## 1. 라이브러리를 사용하지 않고 메모리 사용량 측정하기

<br/>

```markdown
- 메모리 측정 방법 선택
- `V8` 엔진에서 이야기하는 메모리란?
- 메모리 사용을 기록하기 위한 `AST` 선택
- 실행하면 `Heap` 메모리 사용량을 측정, 기록 가능한 `memory tarcker` 함수 제작
- 메모리 사용량 측정의 오차 범위 줄이기
```

프로젝트를 시작하기 전 라이브러리를 사용하지 않고 직접 메모리 사용량을 측정하여 차트로 구현하기로 하였기에 여러 고민이 있었습니다. 우선 자바스크립트 메모리 사용량을 측정할 수 있는 방법부터 알아보기로 합니다.

<br/>

### 1-1. 메모리 측정 방법 선택

<p align="center">
  <img width="744" alt="크롬개발자도구 메모리 탭" src="https://github.com/CODEBLUE3/HeapTracker-client/assets/62285847/b425e383-b36e-4356-9d36-8458acfee16d">
<p>

크롬 개발자 도구를 열어 메모리 탭에 들어가면, 해당 페이지가 사용하는 메모리 사용량을 알 수 있습니다. 이처럼 메모리 변화를 눈으로 보여주는 것을 목표로 두고 방법을 찾아보았습니다.

`Node.js` 환경에서 메모리를 측정할 수 있는 `process.momoryUsage()`를 사용하여 메모리 상태를 누적할 수 있는 함수를 만들기로 합니다. 실시간으로 메모리를 알 수 있는 방법으로 3가지를 찾을 수 있었고, 그 중에서 마지막 `process.memoryUsage()`를 사용하기로 하였습니다.

```markdown
- 브라우저에서 메모리를 측정하는 방법
  - `perfomance API`
- 데스크톱에서 메모리를 측정하는 방법
  - `Node.js` : `writeHeapSnapShot()`
  - `Node.js` : `process.memoryUsage()`
```

<details>
  <summary> preformance API  및  writeHeapSnapShot() 를 사용하지 않은 이유 </summary>
  <div markdown="1">

- `preformance API` 를 사용하지 않은 이유
`performance.memory` 속성은 웹 사이트의 메모리 공간을 측정하여 자바스크립트의 힙 크기를 반환합니다. 실제 메모리 사용량을 과대평가하거나 과소평가 할 수 있으므로 신뢰하기 어렵고 “힙”이 정확히 무엇을 의미하는지 표준화 되지 않았기에 선택하지 않았습니다.

  <br/>

- `writeHeapSnapShot()` 을 사용하지 않은 이유
해당 `API`를 사용하면, `V8` 엔진의 스냅샷을 생성할 수 있습니다. 단, 해당 파일은 크롬 개발자 도구와 함께 사용하기 위한 것이며 힙 스냅샷을 생성하려면 스냅샷이 생성될 때 힙 크기의 약 두 배에 해당하는 메모리가 필요로해 메모리 사용량을 지속적으로 관측하고 싶었던 기획 의도와 맞지 않아 사용하지 못했습니다.

  </div>
</details>
<br/>

```js
// process.memoryUsage 예시

import { memoryUsage } from "node:process";

console.log(memoryUsage());
// Prints:
// {
//  rss: 4935680,
//  heapTotal: 1826816,
//  heapUsed: 650472,
//  external: 49879,
//  arrayBuffers: 9386
// }
```

해당 `API`는 바이트 단위로 측정된 `Node.js` 프로세스의 메모리 사용량을 설명하는 객체를 반환합니다. 메모리 사용량을 지속적으로 관측하고 싶었던 기획 의도로와 적합하다고 생각하여 선택하게 되었습니다. 또한 `Node.js` 환경을 활용하여 안정적으로 메모리를 측정하기 위해, 웹이 아닌 데스크톱 앱을 제작할 수 있는 일렉트론을 사용하여 제작하기로 합니다.

<br/>

### 1-2. `V8엔진`에서 이야기하는 메모리란?

```markdown
process.memoryUsage()

- rss : Resident Set Size
- 📍 heapTotal : refer to V8’s usage.
- 📍 heapUsed : refer to V8’s usage.
```

[출처 : nodejs.org](https://nodejs.org/docs/latest-v18.x/api/process.html#processmemoryusage)

`node.js` 에서 제공하는 `process.memoryUsage()` 는 프로세스의 `Heap` 메모리 사용량을 객체로 반환합니다. 해당 메모리는 동적 데이터를 저장하는 공간으로 사용자 함수가 실행될 때 메모리 변동을 나타낼 수 있을 것이라 생각하였습니다.

<br/>

<p align="center">
  <img src="https://github.com/CODEBLUE3/HeapTracker-client/assets/62285847/67092679-0650-4842-9798-ae68c6d7e19e">
<p>

[출처 : 🚀 Visualizing memory management in V8 Engine (JavaScript, NodeJS, Deno, WebAssembly)](https://deepu.tech/memory-management-in-v8/)

`V8 엔진` 내 메모리는 크게 `Stack`과 `Heap`으로 나뉠 수 있습니다. **접근 가능하며, 변동 추이를 기록하기에 `Heap` 메모리가 알맞다고 생각되었습니다. 이에** `process.memoryUsage()`에서 제공하는 `Heap` 메모리로 메모리 변동 추이를 기록하도록 합니다.

- Heap

  - 객체 또는 동적 데이터를 저장하는 공간입니다.
  - 메모리 영역에서 가장 큰 블록이며 `Garbage Collection(GC)` 이 일어나는 곳입니다.
  - `OS`에서 자동으로 관리되지 않습니다.

- Stack
  - 메서드/함수 프레임, 기본 값 및 개체에 대한 포인터를 포함한 정적 데이터가 저장되는 공간입니다.
  - `V8`자체가 아닌 운영체제에 의해 관리됩니다.

<br/>

### 1-3. 메모리 측정 기준, AST 선택

결론을 먼저 말씀드리자면 사용자 함수가 실행 될 때 `Heap` 메모리 변동을 기록하기 위해 `AST(Abstract syntax tree)`를 기준으로 삼게 되었습니다.

처음 메모리 사용량을 측정하는 기준으로 시간과 위치 2가지를 생각하였습니다.
<br/>

### ❌ 시간 별 메모리 사용량 측정 시도

<p align="center">
  <img src="https://github.com/CODEBLUE3/HeapTracker-client/assets/62285847/38358294-9bb9-4f53-8232-336c733bce4d">
<p>

[예시 : https://github.com/kirill-zhirnov/memory-usage-logger](https://github.com/kirill-zhirnov/memory-usage-logger)

메모리 변경을 기록하는 다른 차트들을 찾아보니 일반적으로 시간의 흐름을 기준으로 삼고 있었습니다. 그래서 1차로 시간의 흐름을 기준으로 메모리 사용량을 측정하는 것을 목표로 하였으나, 측정 단위에서 문제가 발생하였습니다.

<br/>

```markdown
📍 시간 별 메모리 사용량 측정 문제점
사용자 함수가 실행되는 시간 < 호출 타이머의 최소 시간
```

1. 사용자가 입력한 함수가 실행되는 시간은 `ns` (나노초, 10억분의 1초)로 추적할 수 없을 정도로 매우 짧은 시간인 경우가 많았습니다.
2. 자바스크립트에서 `setTimeout`, `setInterval` 등 함수를 시간 별로 호출 할 수 있는 메서드의 한계는 `ms`입니다.

<br/>

시간을 기준으로 메모리를 측정하게 되면 호출 타이머의 최소 시간인 4ms 이하의 속도로 실행되는 코드의 경우 측정 불가능한 문제가 발생하였습니다. 알고리즘 문제를 풀다보면 런타임이 5초 이상인 경우도 생기지만, 보편적인 경우는 아니라고 생각되어 시간이 아닌 다른 기준을 찾고자 하였습니다.

<br/>

### ✅ 위치 별 메모리 사용량 측정 시도

메모리 사용량의 측정 기준으로 시간이 어렵다면, 위치를 측정 기준으로 목표를 변경하였습니다. 사용자 함수 내 특정 위치들에 메모리를 측정할 수 있는 함수의 실행문을 삽입하여, 런타임에 같이 실행시켜 당시의 메모리를 측정하도록 합니다. 아래의 예시에서 `m()`이 메모리를 측정할 수 있는 함수의 예시입니다.

```js
// 트래킹 함수가 삽입된 사용자 함수 코드
// m => 메모리를 측정할 수 있는 함수
// singleSwapSort => 사용자에게 입력 받은 함수의 예시

function singleSwapSort(array) {
  m();

  const sortFunction = (sortArray) => {
    m();
    let startPosition = 0;
    m();
    while (startPosition <= sortArray.length) {
      let comparePosition = sortArray.length - 1;
      m();
      while (startPosition < comparePosition) {
        if (sortArray[startPosition] < sortArray[comparePosition]) {
          comparePosition -= 1;
        } else {
          const value = sortArray[comparePosition];
          m();
          sortArray[comparePosition] = sortArray[startPosition];
          sortArray[startPosition] = value;

          return sortArray;
        }
      }
      startPosition += 1;
    }
    return sortArray;
  };
  m();
}
```

다음으로 메모리 사용량을 측정할 수 있는 함수의 실행 위치를 찾고자 하였습니다. 즉, 사용자 함수 내에서 메모리 사용량을 알 수 있는 `process.memory()`의 실행 위치를 알고자 하였습니다. 실제 `Heap` 메모리의 변동이 있을 만한 곳에서 메모리를 측정할 수 있는 함수가 실행되야 한다고 생각했습니다. 적합한 실행 위치를 찾기 위해서 `V8엔진`의 동작 원리에 주목하게 됩니다.

- `V8엔진` 내부에서 소스코드는 2단계의 과정을 거쳐 바이트 코드로 변환되고 있었습니다.

  ```markdown
  `Source Code` → `AST(Abstract Syntax Tree)` → `Bytecode`

  - `V8 엔진`의 동작원리
    1. 소스 코드를 파서가 분석 후 `AST(Abstract Syntax Tree)`로 변환합니다.
    2. 변환된 `AST`를 `ignition` (인터프리터)가 바이트 코드로 변환합니다.
  ```

  <p align="center">
    <img src="https://github.com/CODEBLUE3/HeapTracker-client/assets/62285847/b3ea36f7-da2b-47ff-a9db-8f014540438c" width="400px">
  </p>

`parser`가 분석 후 변환하는 `AST(Abstract Syntax Tree)`를 활용하면 실제 `Heap` 메모리의 변동이 일어날 만한 코드 위치를 알 수 있을 것이라 생각하였습니다.

`AST(Abstract Syntax Tree)`에서 나타난 크리의 각 노드는 소스 코드에서 발생되는 구조를 나타냅니다. 아래 AST 변환 예시를 보면 구조적, 언어적 의미가 있는 단위로 노드를 생성하고 있다는 것을 알 수 있습니다.

```js
// 예시코드
console.log("hello world");
```

```js
// 예시코드를 AST트리로 변환한 결과
  {
    "type": "Program",
    "start": 0,
    "end": 28,
    "body": [
      {
        "type": "ExpressionStatement",
        "start": 0,
        "end": 27,
        "expression": {
          "type": "CallExpression",
          "start": 0,
          "end": 26,
          "callee": {
            "type": "MemberExpression",
            "start": 0,
            "end": 11,
            "object": {
              "type": "Identifier",
              "start": 0,
              "end": 7,
              "name": "console"
            },
            "property": {
              "type": "Identifier",
              "start": 8,
              "end": 11,
              "name": "log"
            },
            "computed": false,
            "optional": false
          },
          "arguments": [
            {
              "type": "Literal",
              "start": 12,
              "end": 25,
              "value": "hello world",
              "raw": "\"hello world\""
            }
          ],
          "optional": false
        }
      }
    ],
    "sourceType": "module"
  }
```

해당 예시는 `acron` 이라는 파서 라이브러리를 사용하여, 코드를 분석한 결과입니다. 여러가지 정보를 알 수 있음을 확인 할 수 있습니다.

- AST로 확인할 수 있는 정보
  - 타입
  - 해당 코드의 시작, 끝 위치
  - 이름
  - 값
  - 계층 관계 등

해당 정보는 자바스크립트의 의미있는 단위로써 유의미한 `Heap` 메모리 변동을 측정할 수 있는 지표가 될 가능성이 있고, 함수 내 위치 값을 알 수 있다는 점에서 사용하기 적합하다는 생각이 들었습니다. 그리하여 `acorn` 이라는 파스 라이브러리를 사용, 사용자 코드의 `AST`를 기준으로 메모리를 측정할 수 있는 함수의 위치를 설정, 해당 위치에 삽입하도록 하였습니다.

<details>
  <summary> 바이트 코드를 사용하여 위치 기준을 설정하지 않은 이유 </summary>
  <div markdown="2">

    > 바이트 코드는 메모리 사용을 측정할 수 있는 함수의 실행 위치를 알지 못합니다.

처음에는 바이트 코드로의 접근을 생각하였습니다. 바이트 코드로 접근하게 되면 값을 할당하는 과정과 그에 따른 메모리 주소 값을 알 수 있었습니다. 그러나 메모리 주소 값만으로는 함수의 실행 위치를 알기 어렵다는 생각이 들었습니다.

- 바이트 코드 예시

    <p align="center">
      <img width="600px" alt="바이트코드예시1" src="https://github.com/CODEBLUE3/HeapTracker-client/assets/62285847/80ab46a3-50fc-443b-8f68-ed0e159a83ac">
    </p>

    <p align="center">
      <img width="600px" alt="바이트코드예시2" src="https://github.com/CODEBLUE3/HeapTracker-client/assets/62285847/dc360b6e-30bf-469b-83ec-e7dd76161c1d">
    </p>

    </div>
  </details>

<br/>

### 1-4. Heap 메모리 사용량을 측정을 위한 memory tracking 함수 제작

`AST` 를 기준으로 메모리를 측정할 수 있는 함수를 위치를 설정한 뒤, 해당 위치에 `Heap` 메모리를 측정할 수 있는 함수를 삽입하고자 하였습니다. 이 함수를 **메모리 트래킹** 함수라고 부르겠습니다. 메모리 트래킹 함수가 수행하는 역할은 총 3가지 입니다.

```markdown
메모리 트래킹 함수의 역할

1. `process.memoryUsage()` 실행
2. 실행된 `process.memoryUsage()` 얻은 `Heap` 메모리 사용량을 누적하여 기록
3. 사용자에게 제공할 기타 정보 저장 (호출 횟수, 시간, 위치, 타입)
```

해당 함수는 런타임에 사용자가 입력한 함수와 같이 실행됩니다. 해당 메모리 트래킹 함수의 이름이 길어지면 사용자 코드에 삽입될 때 문제가 될 것이라 생각하여 짧게 `m`으로 줄여서 실행시켰습니다. 실행되면서, 당시 `Heap` 메모리를 측정, 기록할 뿐만 아니라 실행될 당시 위치, 타입, 시간, 호출된 횟수 등을 같이 기록합니다. 이를 토대로 제작한 메모리 트래킹 함수는 아래와 같습니다.

```js
//메모리 트래킹 함수
function memoryTracker(start, type) {
  const stroage = [];
  let count = 0;

  return function () {
    count++;

    const newTracking = {
      count,
      totalMemory: process.memoryUsage().heapTotal,
      usedMemory: process.memoryUsage().heapUsed,
      timeStamp: new Date().date,
      startLine: start,
      type: type,
    };

    stroage.push(newTracking);

    return stroage;
  };
}

const m = memoryTracker();
```

해당 메모리 트래킹 함수의 이름이 길어지면 사용자 코드에 삽입될 때 문제가 될 것이라 생각하여 짧게 `m`으로 줄여서 실행시켰습니다. 실제 사용자의 메모리 트래킹 함수 실행문의 삽입예시는 아래와 같습니다.

```js
  // 트래킹 함수가 삽입된 사용자 함수 코드 (기울임 강조)

  function singleSwapSort(array) {
    m(null, “Function singleSwapSort”);

     const sortFunction = (sortArray) => {
        m(null, “ArrowFunction “);
      let startPosition = 0;m(81, null);
         m(null, “While”);
        while (startPosition <= sortArray.length) {
         let comparePosition = sortArray.length - 1;
            m(158, null);
            m(null, “While”);
          while (startPosition < comparePosition) {
           if (sortArray[startPosition] < sortArray[comparePosition]) {
             comparePosition -= 1;
           } else {
             const value = sortArray[comparePosition];
            m(381, null);
             sortArray[comparePosition] = sortArray[startPosition];
             sortArray[startPosition] = value;

             return sortArray;
           }
         }
         startPosition += 1;
       }
       return sortArray;
     }
     m(41, null);
  }
```

<br/>

## 2. 라이브러리를 사용하지 않고 `React`에서 동적 차트 구현하기

### 2-1. `Canvas.API`로 차트 그리기

라이브러리를 사용하지 않고 차트를 구현한 여러 자료를 찾아보니, 크게 `SVG`를 이용하는 방식과 `Canvas.API를` 이용하는 방식 2가지를 사용하고 있었습니다. 각각의 장단점을 생각해보았을 때 `SVG` 방식이 더 손쉬울 것 같긴 하였지만, 많은 양의 데이터를 그리는데 적합한 `Canvas.API`를 선택하게 되었습니다.

```markdown
- SVG 방식
  - 장점 : DOM에 직접 그려지다보니, 이벤트 핸들러 등의 처리가 손쉽다.
  - 단점 : 많은 양의 데이터를 그릴 때 CPU의 사용량이 크게 증가한다.
- Canvas.API 방식
  - 장점 : DOM에 직접 그려지는 것이 아닌 bit-map 형식으로 그려지기 때문에
    많은 양의 데이터가 발생할 시 사용자의 코드에 따라 CPU 증가가 크기 않을 수 있다.
  - 단점 : just pixels.
    그려진 요소가 DOM에 있는 것이 아니기 때문에 이벤트 핸들러 등의 처리가 까다롭다.
```

[HTML5 Canvas vs. SVG vs. div](https://stackoverflow.com/questions/5882716/html5-canvas-vs-svg-vs-div)

<br/>

### 2-2. `Class`를 사용한 차트 추상화 시도

앞서 구현한 메모리 트래킹 함수가 실행되고, 사용자 함수 내 특정위치에서 실행된 메모리 정보를 얻을 수 있었습니다. 그리하여 해당 정보를 가지고 차트를 그리기로 합니다.

```js
//메모리 트래킹 함수 실행 후 얻은 값
[
{ count: 1, totalMemory: 90000, usedMemory: 63423, timeStamp:1678950904231}
{ count: 2, totalMemory: 90000, usedMemory: 73293, timeStamp:1678950904231}
{ count: 3, totalMemory: 90000, usedMemory: 85466, timeStamp:1678950904231}
{ count: 4, totalMemory: 90000, usedMemory: 63040, timeStamp:1678950904231}
{ count: 5, totalMemory: 90000, usedMemory: 64398, timeStamp:1678950904231}
{ count: 6, totalMemory: 90000, usedMemory: 67070, timeStamp:1678950904231}
]
```

사용자에게 차트를 제공 할 때 3가지 사항을 고려하였습니다.

```markdown
1. 3가지 이상의 다양한 차트를 제공할 것

- 라인차트 : 메모리의 변동사항을 자세히 알 수 있음
- 선형차트 : 전체 메모리 상황을 볼 수 있음
- 바 차트 : 변수 별 호출 횟수를 볼 수 있음

2. 차트의 움직임을 동적으로 볼 수 있을 것
```

다양한 차트를 동적으로 구현할 것을 생각해보니 class를 통해 공통 로직과 개별 로직을 분리할 수 있을 것이라 생각하였습니다.

### 2-3 Canvas API를 활용하기 위한 useCanvas() 커스텀 훅을 만들었다면 어땠을까?

프로젝트를 진행하는 도중에는 차트를 만드는 로직을 클래스로 만들어 컴포넌트 외부로 분리하였는데, 되돌아보니 이를 커스텀 훅으로 만들었다면 더 좋았겠다라는 순간이 많았습니다.

### 커스텀 훅은 컴포넌트간에 로직 공유가 자유롭습니다.

차트를 직접 제작하였을 때 단순히 메모리 사용량만 보여주는 것이 아닌, 차트 노드들에 마우스를 올리면 구체적인 정보를 제공하는 모달을 같이 제공하였습니다. 각기 기능은 다르지만, 마우스 이벤트를 3가지 차트 모두 동일하게 일어납니다.

(해당 부분에 gif로 모달을 띄우는 장면 삽입)

차트와 모달은 각기 다른 컴포넌트로 분리되어있어, 리덕스 툴킷을 통해 차트의 상태를 공유하고 있는 상황이었습니다. 리덕스 툴킷에서는 상태를 관리하기 위해서 자체 `hooks`을 제공합니다.

여기서 커스텀 훅의 필요성을 느끼게 되었습니다. 리액트 내부에서 `hooks`을 사용하기 위해선, 컴포넌트 내부라는 조건이 필요한데 문제는 차트 로직이 클래스로 컴포넌트 외부에 선언, 사용되고 있었습니다. 차트를 구현하는 클래스 내부에서 리덕스의 `hooks`을 사용할 수 없어, 이를 클래스의 인자로 받아 구현하게 되었습니다.

(그림 그리기)

만일 차트를 구현하는 로직을 커스텀 훅으로 관리하였다면, 리액트 혹은 리액트의 라이브러리들이 제공하는 커스텀 훅을 적용하는 것에 자유로웠을 것이란 아쉬움이 들었습니다. Canvas API로 차트를 그리는 로직을 커스텀 훅으로 바꾼다면 어떻게 할 수 있을까요?

### `useRef()`리액트 훅으로 `<canvas>` 요소에 접근하기

Canvas API를 사용하여 차트를 구현하기 위해서는 `<canvas>`를 사용해야 합니다. `<canvas>` 엘리먼트에 대한 참조를 얻어은 뒤, 실제 그리기 대상이 되는 컨텍스트를 획득합니다. 즉 DOM에 접근할 필요가 있습니다.

```js
const canvas = document.getElementById("canvas");
//실제 그리기 대상이 되는 컨텍스트를 획득합니다.
const ctx = canvas.getContext("2d");
```

리액트는 직접 DOM을 변경하거나 참조해야하는 경우를 위해 `useRef()`라는 훅을 제공합니다. Canvas API는 웹 브라우저에 내장 된 기능으로, DOM을 참조한 뒤 컨텍스트를 획득하여 사용자가 여러 그림을 그릴 수 있게 합니다.

```javascript
import { useRef } from "react";

export default function Chart () {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvasRef.current;
    const ctx = canvas.getContext("2d");
  });

  return <cansvas ref={canvasRef}>
}
```

`<canvas>`가 최초 랜더링 된 뒤, 캔버스 컨텍스트를 가져오기 위해 `useEffect` 안에서 `useRef()`가 반환한 객체의 current 속성에 접근하였습니다.

### `useChart()` 커스텀 훅을 만들어 재사용성 높이기

현재 3가지 차트를 제공하고 있는데, 이를 클래스가 아닌 커스텀 훅으로 만들었다면 리액트에서 캔버스로 차트를 그리기 위한 공통된 내용들을 `useChart()`로 관리 할 수 있습니다.

(커스텀 훅으로 차트를 구현할 때의 예시)

# 🔹 Schedule

- 1주차

  - 아이디어 수집, 선정
  - 기술 스택 선정
  - Git 작업 플로우 결정
  - ESLint, Prettier, Husky 설정
  - KANBAN 작성

- 2주차
  - Electron 설정 및 리액트 설정
  - AST를 이용한 CodeParser 구현
  - Canvas API를 이용한 차트 구현
  - 테스트 코드 작성
  - README 작성

# 🔹 Tech Stacks

FrontEnd

- Electron
- React
- Redux
- Styled Components

# 🔹 Member

- 강현준 :[steady.kang27@gmail.com](steady.kang27@gmail.com)
- 정재천 :[isintheskyj@gmail.com](isintheskyj@gmail.com)
- 최예린 :[lin01.dev@gmail.com](lin01.dev@gmail.com)

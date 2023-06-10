# 🔹 Heap-Tracker

<p align="center">
<img src="https://github.com/CODEBLUE3/HeapTracker-client/assets/62285847/a1641542-256a-4673-b966-cf6c2af41103" width="400"/>
</p>

- `Heap-Tracker`는 유저가 입력한 자바스크립트 코드의 힙 메모리 사용량을 차트로 시각화한 웹 어플리케이션입니다.
- 최대, 최소 힙 메모리 사용량 및 런타임 시간 등 여러 정보를 차트와 함께 제공합니다.

<br/>

# 🔹 Motivation

내가 풀이한 알고리즘의 메모리 사용량을 정밀하게 측정해보면 어떨까?라는 생각으로 프로젝트를 출발하게 되었습니다.

<br/>

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

<br/>

프로젝트를 시작하기 전 라이브러리를 사용하지 않고 직접 메모리 사용량을 측정하여 차트로 구현하기로 하였기에 여러 고민이 있었습니다. 우선 자바스크립트 메모리 사용량을 측정할 수 있는 방법부터 알아보기로 합니다.
<br/>

<br/>

### 1) 메모리 측정 방법 선택

> Node.js 환경에서 메모리를 측정할 수 있는 process.momoryUsage()를 사용하여 메모리 사용량을 추적할 수 있는 함수를 만들기로 하였습니다.
> 

<br/>

- 기획의도
<p align="center">
  <img width="744" alt="크롬개발자도구 메모리 탭" src="https://github.com/CODEBLUE3/HeapTracker-client/assets/62285847/b425e383-b36e-4356-9d36-8458acfee16d">
<p>

크롬 개발자 도구를 열어 메모리 탭에 들어가면, 해당 페이지가 사용하는 메모리 사용량을 알 수 있습니다. 이처럼 메모리 변화를 눈으로 보여주는 것을 목표로 두고 방법을 찾아보았습니다.

실시간으로 메모리를 추적할 수 있는 방법으로 3가지를 찾을 수 있었고, 그 중에서 마지막 `process.memoryUsage()`를 사용하기로 합니다.

```markdown
- 브라우저에서 메모리를 측정하는 방법
    - `perfomance API`
- 데스크톱에서 메모리를 측정하는 방법
    - `Node.js` : `writeHeapSnapShot()`
    - `Node.js` : `process.memoryUsage()`

```

<br/>
해당 `API`는 바이트 단위로 측정된 `Node.js` 프로세스의 메모리 사용량을 설명하는 객체를 반환합니다. 메모리 사용량을 지속적으로 관측하고 싶었던 기획 의도로와 적합하다고 생각하여 선택하게 되었습니다. 또한 `Node.js` 환경을 활용하여 안정적으로 메모리를 측정하기 위해, 웹이 아닌 데스크톱 앱을 제작할 수 있는 익렉트론을 사용하여 제작하기로 합니다.
<br/>

```js
// process.memoryUsage 예시

import { memoryUsage } from 'node:process';

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

<details>
<summary> preformance API  및  writeHeapSnapShot() 를 사용하지 않은 이유 </summary>
<div markdown="1">
  
- `preformance API` 를 사용하지 않은 이유
`performance.memory` 속성은 웹 사이트의 메모리 공간을 측정하여 자바스크립트의 힙 크기를 반환합니다.  실제 메모리 사용량을 과대평가하거나 과소평가 할 수 있으므로 신뢰하기 어렵고 “힙”이 정확히 무엇을 의미하는지 표준화 되지 않았기에 선택하지 않았습니다.
  
  <br/>
    
- `writeHeapSnapShot()` 을 사용하지 않은 이유
해당 `API`를 사용하면, `V8`  엔진의 스냅샷을 생성할 수 있습니다. 단, 해당 파일은 크롬 개발자 도구와 함께 사용하기 위한 것이며 힙 스냅샷을 생성하려면 스냅샷이 생성될 때 힙 크기의 약 두 배에 해당하는  메모리가 필요로해 메모리 사용량을 지속적으로 관측하고 싶었던 기획 의도와 맞지 않아 사용하지 못했습니다.

</div>
</details>

<br/>

### 2) `V8엔진`에서 이야기하는 메모리란?
`node.js` 에서 제공하는 `process.memoryUsage()` 는 프로세스의 `Heap` 메모리 사용량을 객체로 반환합니다. 해당 메모리는 동적 데이터를 저장하는 공간으로 메모리 변동을 나타낼 수 있을 것이라 생각하였습니다. 
<br/>
  
  > process.memoryUsage()
  > - rss : Resident Set Size
  > - **heapTotal : refer to V8’s usage.**
  > - **heapUsed :  refer to V8’s usage.**
  
[출처 : nodejs.org](https://nodejs.org/docs/latest-v18.x/api/process.html#processmemoryusage)

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

### 3. 메모리 측정 기준, AST 선택
결론을 먼저 말씀드리자면 사용자 함수가 실행 될 때 `Heap` 메모리 변동을 기록하기 위해 AST(Abstract syntax tree)를 기준으로 삼게 되었습니다.
  
<br/>
처음 메모리 사용량을 측정하는 기준으로 시간과 위치 2가지를 생각하였습니다.
<br/>
  
- 시간 별 메모리 사용량 측정 시도
  <p align="center">
    <img src="https://github.com/CODEBLUE3/HeapTracker-client/assets/62285847/38358294-9bb9-4f53-8232-336c733bce4d">
  <p>
  
  [https://github.com/kirill-zhirnov/memory-usage-logger](https://github.com/kirill-zhirnov/memory-usage-logger)  
  
  기존 메모리 차트 예시의 경우 시간의 흐름을 기준으로 하는 것이 일반적이었습니다. 그래서 시간의 흐름을 기준으로 메모리 사용량을 측정하였으나, 측정 단위에서 문제가 발생하였습니다.
    
   > 시간 별 메모리 사용량 측정 문제점
    사용자 함수가 실행되는 시간 < 호출 타이머의 최소 시간
  
  1. 사용자가 입력한 함수가 실행되는 시간은 `ns` (나노초, 10억분의 1초)로 추적할 수 없을 정더로 매우 짧은 시간인 경우가 많았습니다.
  2. 자바스크립트에서 `setTimeout`, `setInterval` 등 함수를 시간 별로 호출 할 수 있는 메서드의 한계는 `ms`입니다.
 
  <br/>
    
  위와 같이 시간을 기준으로 메모리를 측정하게 되며느 호출 타이머의 최소 시간인 4ms 이하의 속도로 실행되는 코드의 경우 측정 불가능한 문제가 발생하였습니다. 알고리즘 문제를 풀다보면 런타임이 5초 이상인 경우도 생기지만, 보편적인 경우는 아니라고 생각되어 시간이 아닌 다른 기준으로 메모리 사용량을 측정하게 됩니다.
<br/>
<br/>

- 위치 별 메모리 사용량 측정 시도
  
  <br/>
   
  > 사용자 코드를 특정 위치에 메모리 트래킹이 가능한 함수를 삽입하여 메모리 변동에 대한 추이를 알고자 하였습니다.  
  
  메모리 사용량의 측정 기준으로 시간이 어렵다면, 위치를 기준으로 목표를 변경하였습니다. 사용자 함수가 메모리 트래킹 함수와 같이 실행된다면, 런타임에 메모리를 측정하는 것이 가능할 것이라 생각하였기 때문입니다. 위치 별 메모리 사용량을 시도하기 위해서는 2가지 조건이 필요하였습니다.
    
  ```markdown
    
    1. 메모리 사용량을 측정할 수 있는 함수
    2. 메모리 사용을 측정할 수 있는 함수의 실행 위치 
    
  ```
    
  <br/>
    
  > 실제 `Heap` 메모리의 변동이 있을만한 곳에 메모리 트래킹 함수가 실행되어야 한다고 생각했습니다.
우선 메모리 사용량을 측정할 수 있는 함수의 실행 위치를 찾고자 하였습니다. 즉, 사용자 함수 내에서 메모리 사용량을 알 수 있는 `process.memory`의 실행 위치를 알고자 하였습니다. 적합한 실행 위치를 찾기 위해서 `V8엔진`의 동작 원리에 주목하게 됩니다.
    
  <br/>
    
  - 소스코드는 2단계의 과정을 거쳐 바이트 코드로 변환되고 있었습니다.
    
  ```markdown
  `Source Code` → `AST(Abstract Syntax Tree)` → `Bytecode`
  
  - V8 엔진의 동작원리
    1. 소스 코드를 파서가 분석 후 `AST(Abstract Syntax Tree)`로 변환합니다.
    2. 변환된 `AST`를 `ignition` (인터프리터)가 바이트 코드로 변환합니다.
  ````
  <p align="center">
    <img src="https://github.com/CODEBLUE3/HeapTracker-client/assets/62285847/b3ea36f7-da2b-47ff-a9db-8f014540438c" width="400px">
  </p>
  

  > 바이트 코드는 메모리 사용을 측정할 수 있는 함수의 실행 위치를 알지 못합니다. 
  
  <br/>
  처음에는 바이트 코드로의 접근을 생각하였습니다. 바이트 코드로 접근하게 되면 값을 할당하는 과정과 그에 따른 메모리 주소 값을 알 수 있었습니다. 그러나 메모리 주소 값만으로는 함수의 실행 위치를 알기 어렵다는 생각이 들었습니다.
  
  - 바이트 코드 예시

  <p align="center">
    <img width="600px" alt="바이트코드예시1" src="https://github.com/CODEBLUE3/HeapTracker-client/assets/62285847/80ab46a3-50fc-443b-8f68-ed0e159a83ac">
  </p>
  
  <p align="center">
    <img width="600px" alt="바이트코드예시2" src="https://github.com/CODEBLUE3/HeapTracker-client/assets/62285847/dc360b6e-30bf-469b-83ec-e7dd76161c1d">
  </p>
  
  <br/>
  
  > AST(Abstract syntax tree)는 메모리 사용을 측정할 수 있는 함수의 실행 위치를 알 수 있습니다.
 
    컴퓨터 과학에서 추상구문트리(Abstract syntax tree)는 프로그래밍 언어로  작성된 소스 코드의 추상 구문 구조의 트리입니다. 이 트리의 각 노드는 소스 코드에서 발생되는 구조를 나타냅니다. 아래 AST 변환 예시를 보면 구조적, 언어적 의미가 있는 단위로 노드를 생성하고 있다는 것을 알 수 있습니다.
    
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
  
  <br/>
  
  해당 예시는 `acron` 이라는 파서 라이브러리를 사용하여, 코드를 분석한 결과입니다. 여러가지 정보를 알 수 있음을 확인 할 수 있습니다. 

  - AST로 확인할 수 있는 정보
      - 타입
      - 해당 코드의 시작, 끝 위치
      - 이름
      - 값
      - 계층 관계

  해당 정보는 1. 유의미한 `Heap` 메모리 변동을 측정할 수 있고, 2. 메모를 추적할 수 있는 함수의 실행 위치 (코드의 시작, 끝 위치)를 알 수 있다는 점에서 사용하기 적합하다는 생각이 들었습니다.
  
  > 그리하여 acorn 이라는 파스 라이브러리를 사용, 사용자 코드의 AST를 기준으로 메모리를 측정할 수 있는 함수의 위치를 설정, 해당 위치에 삽입하도록 결정합니다.
  
  
### 4.실행하면 Heap 메모리 사용량을 측정할 수 있는, memory tracker 함수 제작 
`AST` 를 기준으로 메모리를 측정할 수 있는 함수를 위치를 설정, 해당 위치에 메모리 트래킹이 가능한 함수를 삽입하고자 하였습니다. 메모리 트래킹 함수가 수행하는 역할은 총 2가지 입니다.

> 메모리 트래킹 함수의 역할
  1. `process.memoryUsage()` 실행 
  2. 실행된 `process.memoryUsage()` 얻은 `Heap` 메모리 사용량을 누적하여 기록
  
<br/>
이를 토대로 제작한 메모리 트래킹 함수는 아래와 같습니다.

<br/>

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
			type: type
			}
			
		stroage.push(newTracking);
		
		return stroage;
  }
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

# 🔹 Schedule
<details>
  <summary> 1주차 </summary>
  <div markdown="1">

  - 아이디어 수집, 선정
  - 기술 스택 선정
  - Git 작업 플로우 결정
  - ESLint, Prettier, Husky 설정
  - KANBAN 작성

  </div>
</details>

<details>
  <summary> 2주차 </summary>
  <div markdown="1">

  - Electron 설정 및 리액트 설정
  - AST를 이용한 CodeParser 구현
  - Canvas API를 이용한 차트 구현
  - 테스트 코드 작성
  - README 작성

  </div>
</details>

# 🔹 Tech Stacks
FrontEnd

- Electron
- React
- Redux
- Styled Components

# 🔹 Repository Link
- [`preformance API`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory)
- [`process.memoryUsage()`](https://nodejs.org/dist/latest-v18.x/docs/api/process.html#processmemoryusage)
- [자바스크립트 메모리 관리](https://developer.mozilla.org/ko/docs/Web/JavaScript/Memory_management)
- [당신이 모르는 자바스크립트 메모리 누수의 비밀](https://ui.toast.com/posts/ko_20210611)
- [Visualizing memory management in V8 Engine (JavaScript, NodeJS, Deno, WebAssembly)](https://deepu.tech/memory-management-in-v8/)
- [Understanding Garbage Collection and hunting Memory Leaks in NodeJS](https://www.dynatrace.com/news/blog/understanding-garbage-collection-and-hunting-memory-leaks-in-node-js/)

# Member
- 강현준 :[steady.kang27@gmail.com](steady.kang27@gmail.com)
- 정재천 :[isintheskyj@gmail.com](isintheskyj@gmail.com)
- 최예린 :[lin01.dev@gmail.com](lin01.dev@gmail.com)



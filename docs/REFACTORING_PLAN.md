# HeapTracker-Client 리팩토링 계획서

## 📋 문서 정보
- **작성일**: 2025-11-06
- **프로젝트**: HeapTracker-Client
- **목적**: 코드 중복 제거 및 유지보수성 향상
- **브랜치**: claude/refac-011CUroHbLw1mKfMnu58ZoHh

---

## 🎯 프로젝트 개요

### 애플리케이션 타입
- **구조**: Electron Desktop Application + React Frontend
- **목적**: JavaScript 코드 실행 시 메모리 힙 사용량 실시간 시각화
- **핵심 기술 스택**:
  - Frontend: React 18.2.0, Redux Toolkit, Styled Components
  - Desktop: Electron 23.1.3
  - Code Analysis: Acorn (AST Parser)
  - Code Editor: CodeMirror 6
  - Visualization: Canvas API
  - Testing: Jest, React Testing Library, Playwright

### 디렉토리 구조
```
src/
├── app/                 # Redux store 설정
├── component/          # React UI 컴포넌트 (차트, 입력, 모달)
├── electron/           # Electron main/renderer/preload
├── features/           # Redux 슬라이스 (상태 관리)
├── hooks/              # 커스텀 React 훅
├── pages/              # 최상위 페이지 컨테이너
├── styles/             # 전역 스타일, 테마, 상수
└── utils/              # 차트 클래스, 코드 파서, 메모리 트래커
```

---

## 🔍 발견된 중복 영역

### 우선순위 매트릭스

| 순위 | 영역 | 파일 수 | 중복 코드량 | 영향도 | 난이도 |
|------|------|---------|-------------|--------|--------|
| **1** | Chart 클래스 | 3개 | ~150줄 | 🔴 HIGH | 중간 |
| **2** | Code 에디터 | 2개 | ~25줄 | 🟡 MEDIUM | 낮음 |
| **3** | Modal Redux | 2개 | ~90줄 | 🟡 MEDIUM | 중간 |
| **4** | Modal 컴포넌트 | 3개 | ~90줄 | 🟡 MEDIUM | 낮음 |
| **5** | Node 클래스 | 2개 | ~60줄 | 🟡 MEDIUM | 중간 |
| **6** | 테스트 패턴 | 다수 | ~15줄/파일 | 🟡 MEDIUM | 낮음 |

---

## 📝 단계별 리팩토링 계획

## 1단계: Chart 클래스 중복 제거 (최우선 🔴)

### 현재 상태 분석

#### 영향을 받는 파일
```
src/utils/LineChart.js          (352줄)
src/utils/BarChart.js           (295줄)
src/utils/VariableBarChart.js   (315줄)
```

#### 중복 코드 영역

**1) Canvas 초기화 (동일 코드 3회 반복)**
```javascript
// 위치: 각 파일 constructor 시작 부분
this.canvas = document.getElementById(id);
this.ctx = this.canvas.getContext("2d");
this.canvas.width = this.canvas.clientWidth;
this.canvas.height = this.canvas.clientHeight;
this.canvas.style.width = `${this.canvasWidth}px`;
this.canvas.style.height = `${this.canvasHeight}px`;
this.ctx.font = "0.8rem Arial";
```

**2) 마우스 이벤트 처리 (거의 동일한 구조)**
```javascript
// LineChart.js: 50-92줄
// BarChart.js: 51-84줄
// VariableBarChart.js: 49-71줄

this.canvas.addEventListener("mousemove", (event) => {
  const rect = this.canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  let hoveredNode = null;
  this.chartData.forEach((node) => {
    if (node.isMouseOver(mouseX, mouseY)) {
      hoveredNode = node;
    }
  });

  // 모달 데이터 구성 (동일)
  if (hoveredNode) {
    const chartModalData = {
      codeCount: node.data.count,
      codeType: node.data.codeType,
      codePosition: node.data.codePosition,
      usedMemory: node.data.usedMemory,
      timeStamp: node.data.timeStamp,
    };
    // ... Redux dispatch
  }
});
```

**3) 테마 색상 설정 (완전히 동일)**
```javascript
// LineChart.js: 301-318줄
// BarChart.js: 279-295줄
// VariableBarChart.js: 290-315줄

setColor = (theme) => {
  this.backgroundColor = theme.boxBackground;
  this.gridColor = theme.gridLine;
  this.lineColor = theme.borderLine;
  this.textColor = theme.unitText;
  this.nodeColor = theme.chartDot;
  this.nodeHoverColor = theme.chartDotHover;
  return this;
};

setLineColor = (theme) => {
  this.lineColor = theme.borderLine;
};
```

**4) 재생/정지 제어 (유사한 로직)**
```javascript
// LineChart.js: 134-165줄
// BarChart.js: 188-230줄
// VariableBarChart.js: 143-183줄

playback = () => {
  this.isPlay = true;
  this.intervalID = setInterval(() => {
    this.updateData();
  }, this.playbackSpeed);
  return this;
};

pause = () => {
  this.isPlay = false;
  clearInterval(this.intervalID);
  return this;
};

stop = () => {
  this.isPlay = false;
  this.currentPosition = 0;
  clearInterval(this.intervalID);
  this.chartData = [];
  this.drawChart();
  return this;
};
```

**5) 데이터 초기화 (유사한 패턴)**
```javascript
// LineChart.js: 97-128줄
// BarChart.js: 232-273줄
// VariableBarChart.js: 76-137줄

setData = (data) => {
  this.data = data;
  this.maxMemory = Math.max(...data.map(d => d.usedMemory));
  this.minMemory = Math.min(...data.map(d => d.usedMemory));
  // ... 차트별로 약간 다른 계산
  return this;
};
```

**6) 애니메이션 업데이트 (동일한 구조)**
```javascript
// LineChart.js: 281-292줄
// BarChart.js: 195-204줄
// VariableBarChart.js: 214-224줄

updateData = () => {
  if (!this.data.length) return;
  this.drawChart();
  this.currentPosition += 1;

  if (this.currentPosition >= this.data.length) {
    clearInterval(this.intervalID);
    this.currentPosition = 0;
  }
};
```

### 리팩토링 설계

#### BaseChart 클래스 구조

```javascript
// src/utils/BaseChart.js

class BaseChart {
  constructor(id, canvasWidth, canvasHeight, playbackSpeed, dispatch) {
    // 공통 Canvas 초기화
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.playbackSpeed = playbackSpeed;
    this.dispatch = dispatch;

    // 공통 상태 변수
    this.data = [];
    this.chartData = [];
    this.currentPosition = 0;
    this.intervalID = null;
    this.isPlay = false;

    // Canvas 설정
    this._initializeCanvas();

    // 이벤트 리스너 등록
    this._setupEventListeners();
  }

  // 추상 메서드 (하위 클래스에서 구현 필수)
  drawChart() {
    throw new Error("drawChart() must be implemented by subclass");
  }

  // 공통 메서드들
  _initializeCanvas() { /* ... */ }
  _setupEventListeners() { /* ... */ }
  _createModalData(node) { /* ... */ }
  setColor(theme) { /* ... */ }
  setLineColor(theme) { /* ... */ }
  setData(data) { /* ... */ }
  playback() { /* ... */ }
  pause() { /* ... */ }
  stop() { /* ... */ }
  updateData() { /* ... */ }
}
```

#### 리팩토링 후 LineChart 예시

```javascript
// src/utils/LineChart.js

import BaseChart from "./BaseChart";
import ChartNode from "./ChartNode";

class LineChart extends BaseChart {
  constructor(id, canvasWidth, canvasHeight, playbackSpeed, dispatch) {
    super(id, canvasWidth, canvasHeight, playbackSpeed, dispatch);
    // LineChart만의 특별한 초기화
  }

  // LineChart 고유 구현만 남김
  drawChart() {
    // LineChart 전용 그리기 로직
    this._drawBackground();
    this._drawGrid();
    this._drawLineGraph();
  }

  _drawBackground() { /* ... */ }
  _drawGrid() { /* ... */ }
  _drawLineGraph() { /* ... */ }
}

export default LineChart;
```

### 예상 효과

**코드 감소량:**
- BaseChart.js: +200줄 (신규)
- LineChart.js: 352줄 → ~150줄 (-200줄)
- BarChart.js: 295줄 → ~120줄 (-175줄)
- VariableBarChart.js: 315줄 → ~140줄 (-175줄)
- **순 감소: 약 350줄 (36% 감소)**

**개선 효과:**
- ✅ 공통 버그 수정 시 한 곳만 수정
- ✅ 새로운 차트 타입 추가 용이 (BaseChart 상속)
- ✅ 일관된 동작 보장
- ✅ 테스트 작성 용이

### 작업 체크리스트

- [ ] BaseChart.js 추상 클래스 생성
  - [ ] Canvas 초기화 로직
  - [ ] 마우스 이벤트 처리
  - [ ] 테마 색상 설정
  - [ ] 재생/정지/멈춤 제어
  - [ ] 데이터 초기화
  - [ ] 애니메이션 업데이트
- [ ] LineChart.js 리팩토링
  - [ ] BaseChart 상속
  - [ ] 중복 코드 제거
  - [ ] drawChart() 구현
- [ ] BarChart.js 리팩토링
  - [ ] BaseChart 상속
  - [ ] 중복 코드 제거
  - [ ] drawChart() 구현
- [ ] VariableBarChart.js 리팩토링
  - [ ] BaseChart 상속
  - [ ] 중복 코드 제거
  - [ ] drawChart() 구현
- [ ] 테스트 실행 및 검증
  - [ ] LineChart.test.js 통과 확인
  - [ ] Chart.test.js 통과 확인
  - [ ] 수동 UI 테스트

---

## 2단계: Code 에디터 컴포넌트 통합 🟡

### 현재 상태 분석

#### 영향을 받는 파일
```
src/component/CodeInput.js
src/component/CodeExecution.js
```

#### 중복 코드

```javascript
// 두 파일 모두 동일한 import
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

// 거의 동일한 CodeMirror 설정
<CodeMirror
  extensions={[javascript({ jsx: false })]}
  theme={theme}
  onChange={onChange}
  value={value}
/>

// 유사한 styled-component
const CodeContainer = styled.div`
  box-shadow: 0 0 10px ${(props) => props.theme.defaultBorder};
  // 높이와 너비만 다름
`;
```

### 리팩토링 설계

#### 신규 CodeEditor 컴포넌트

```javascript
// src/component/CodeEditor.js

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import styled from "styled-components";

const CodeEditor = ({ value, onChange, theme, height = "450px", width = "100%" }) => {
  return (
    <CodeContainer height={height} width={width}>
      <CodeMirror
        extensions={[javascript({ jsx: false })]}
        theme={theme}
        onChange={onChange}
        value={value}
      />
    </CodeContainer>
  );
};

const CodeContainer = styled.div`
  height: ${(props) => props.height};
  width: ${(props) => props.width};
  box-shadow: 0 0 10px ${(props) => props.theme.defaultBorder};
`;

export default CodeEditor;
```

#### 리팩토링 후 사용

```javascript
// CodeInput.js → CodeEditor로 대체
<CodeEditor value={value} onChange={onChange} theme={theme} height="450px" />

// CodeExecution.js → CodeEditor로 대체
<CodeEditor value={value} onChange={onChange} theme={theme} height="70px" width="85%" />
```

### 작업 체크리스트

- [ ] CodeEditor.js 공통 컴포넌트 생성
- [ ] CodeInput.js에서 CodeEditor 사용
- [ ] CodeExecution.js에서 CodeEditor 사용
- [ ] 테스트 업데이트
- [ ] 기능 검증

---

## 3단계: Modal Redux 슬라이스 중복 제거 🟡

### 현재 상태 분석

#### 영향을 받는 파일
```
src/features/chartModal/chartModalSlice.js
src/features/chartModal/variableBarModalSlice.js
```

#### 중복 구조

```javascript
// 두 파일 모두 동일한 패턴
const initialState = {
  data: {
    codeCount: 0,
    codeType: "",
    codePosition: "",
    usedMemory: 0,
    timeStamp: 0,
  },
  styles: {
    visibility: false,
    top: 0,
    left: 0,
  },
};

// 동일한 reducer 패턴
reducers: {
  setData: (state, action) => { /* ... */ },
  setStyle: (state, action) => { /* ... */ },
  hidden: (state) => { /* ... */ },
}
```

### 리팩토링 설계

#### Modal 슬라이스 팩토리 함수

```javascript
// src/features/modal/createModalSlice.js

import { createSlice } from "@reduxjs/toolkit";

export const createModalSlice = (name, dataFields) => {
  const initialState = {
    data: dataFields,
    styles: {
      visibility: false,
      top: 0,
      left: 0,
    },
  };

  return createSlice({
    name,
    initialState,
    reducers: {
      setData: (state, action) => {
        state.data = action.payload;
      },
      setStyle: (state, action) => {
        state.styles = { ...state.styles, ...action.payload };
      },
      hidden: (state) => {
        state.styles.visibility = false;
      },
    },
  });
};
```

#### 리팩토링 후 사용

```javascript
// chartModalSlice.js
import { createModalSlice } from "../modal/createModalSlice";

const chartModalSlice = createModalSlice("chartModal", {
  codeCount: 0,
  codeType: "",
  codePosition: "",
  usedMemory: 0,
  timeStamp: 0,
});

export const { setData, setStyle, hidden } = chartModalSlice.actions;
export default chartModalSlice.reducer;
```

### 작업 체크리스트

- [ ] createModalSlice.js 팩토리 함수 생성
- [ ] chartModalSlice.js 리팩토링
- [ ] variableBarModalSlice.js 리팩토링
- [ ] Redux store 설정 업데이트
- [ ] 테스트 업데이트
- [ ] 기능 검증

---

## 4단계: Modal 컴포넌트 중복 제거 🟡

### 현재 상태 분석

#### 영향을 받는 파일
```
src/component/ChartModal.js
src/component/LineChartModal.js
src/component/VariableBarModal.js
```

#### 중복 코드

```javascript
// 세 파일 모두 동일한 Container
const Container = styled.div`
  position: absolute;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  padding: 10px 20px;
  border-radius: ${style.borderRadius};
  background-color: ${(props) => props.theme.chartModal};
  visibility: ${(props) => props.visibility === "true" ? "visible" : "hidden"};
`;

// 동일한 POSITION_UNIT
const POSITION_UNIT = "px";

// 동일한 props 전달 패턴
<Container
  visibility={String(visibility)}
  top={top + POSITION_UNIT}
  left={left + POSITION_UNIT}
>
  {children}
</Container>
```

### 리팩토링 설계

#### 신규 ModalContainer 컴포넌트

```javascript
// src/component/ModalContainer.js

import styled from "styled-components";
import { style } from "../styles/styleCode";

const ModalContainer = ({ children, visibility, top, left }) => {
  const POSITION_UNIT = "px";

  return (
    <Container
      visibility={String(visibility)}
      top={top + POSITION_UNIT}
      left={left + POSITION_UNIT}
    >
      {children}
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  padding: 10px 20px;
  border-radius: ${style.borderRadius};
  background-color: ${(props) => props.theme.chartModal};
  visibility: ${(props) => props.visibility === "true" ? "visible" : "hidden"};
`;

export default ModalContainer;
```

### 작업 체크리스트

- [ ] ModalContainer.js 공통 컴포넌트 생성
- [ ] ChartModal.js 리팩토링
- [ ] LineChartModal.js 리팩토링
- [ ] VariableBarModal.js 리팩토링
- [ ] 테스트 업데이트
- [ ] 기능 검증

---

## 5단계: Node 클래스 중복 제거 🟡

### 현재 상태 분석

#### 영향을 받는 파일
```
src/utils/ChartNode.js (원형 노드)
src/utils/BarNode.js (사각형 노드)
```

#### 유사한 구조

```javascript
// 두 클래스 모두 유사한 메서드
class ChartNode {
  constructor(x, y, data, ctx) { /* ... */ }
  getPosition() { /* ... */ }
  getData() { /* ... */ }
  isMouseOver(mouseX, mouseY) { /* 원형 감지 */ }
  draw(color) { /* 원 그리기 */ }
}

class BarNode {
  constructor(x, y, data, ctx, width, height) { /* ... */ }
  getPosition() { /* ... */ }
  getData() { /* ... */ }
  isMouseOver(mouseX, mouseY) { /* 사각형 감지 */ }
  draw(color) { /* 사각형 그리기 */ }
}
```

### 리팩토링 설계

#### BaseChartNode 클래스

```javascript
// src/utils/BaseChartNode.js

class BaseChartNode {
  constructor(x, y, data, ctx) {
    this.x = x;
    this.y = y;
    this.data = data;
    this.ctx = ctx;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  getData() {
    return this.data;
  }

  // 추상 메서드 (하위 클래스에서 구현)
  isMouseOver(mouseX, mouseY) {
    throw new Error("isMouseOver() must be implemented");
  }

  draw(color) {
    throw new Error("draw() must be implemented");
  }
}

export default BaseChartNode;
```

### 작업 체크리스트

- [ ] BaseChartNode.js 베이스 클래스 생성
- [ ] ChartNode.js 리팩토링 (BaseChartNode 상속)
- [ ] BarNode.js 리팩토링 (BaseChartNode 상속)
- [ ] 테스트 업데이트
- [ ] 기능 검증

---

## 6단계: 테스트 유틸리티 헬퍼 생성 🟡

### 현재 상태 분석

#### 반복되는 테스트 패턴
```javascript
// 모든 테스트 파일에서 반복
import { Provider } from "react-redux";
import { render } from "@testing-library/react";

render(
  <Provider store={store}>
    <Component />
  </Provider>
);
```

### 리팩토링 설계

#### 테스트 헬퍼 유틸리티

```javascript
// tests/utils/test-helpers.js

import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

export const renderWithRedux = (
  component,
  {
    initialState = {},
    store = configureStore({ reducer: {}, preloadedState: initialState }),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  return render(component, { wrapper: Wrapper, ...renderOptions });
};
```

#### 리팩토링 후 사용

```javascript
// Chart.test.js
import { renderWithRedux } from "../utils/test-helpers";

test("renders chart", () => {
  renderWithRedux(<Chart />);
  // ...
});
```

### 작업 체크리스트

- [ ] test-helpers.js 생성
- [ ] 모든 테스트 파일 업데이트
- [ ] 테스트 실행 및 검증

---

## ⚠️ 리팩토링 주의사항

### 일반 원칙
1. **테스트 우선**: 각 단계 전후 테스트 실행
2. **점진적 적용**: 한 번에 하나의 영역만 수정
3. **기능 보존**: UI/UX 변경 없이 내부 구조만 개선
4. **Git 커밋**: 각 단계별 의미 있는 커밋 메시지

### Git 전략
```bash
# 각 단계별 커밋 형식
refactor: implement BaseChart abstract class
refactor: migrate LineChart to extend BaseChart
refactor: migrate BarChart to extend BaseChart
refactor: migrate VariableBarChart to extend BaseChart
test: update chart tests after refactoring

refactor: create reusable CodeEditor component
refactor: replace CodeInput with CodeEditor
refactor: replace CodeExecution with CodeEditor

# ... (이하 각 단계별 커밋)
```

### 테스트 전략
```bash
# 각 단계 후 실행
npm test                           # 모든 단위 테스트
npm run test -- Chart.test.js      # 특정 테스트
npm start                          # 수동 UI 테스트
```

### 롤백 계획
- 각 단계는 독립적으로 롤백 가능
- 문제 발생 시 이전 커밋으로 복귀
- 단계별 브랜치 생성 고려

---

## 📊 예상 개선 효과

### 정량적 효과
| 항목 | 현재 | 목표 | 개선율 |
|------|------|------|--------|
| 전체 코드 라인 수 | ~3,500줄 | ~3,000줄 | -14% |
| Chart 클래스 | ~960줄 | ~610줄 | -36% |
| 중복 코드 비율 | ~18% | ~5% | -72% |
| 테스트 보일러플레이트 | ~150줄 | ~50줄 | -67% |

### 정성적 효과
- ✅ **유지보수성**: 버그 수정 시 한 곳만 수정
- ✅ **확장성**: 새로운 기능 추가 용이
- ✅ **가독성**: 코드 구조 명확화
- ✅ **테스트 용이성**: 공통 로직 테스트 한 번
- ✅ **일관성**: 동작 패턴 통일화

### 장기적 이점
- 새로운 팀원 온보딩 시간 단축
- 기능 추가 속도 향상
- 버그 발생률 감소
- 코드 리뷰 시간 단축

---

## 📅 진행 일정

### 권장 일정 (1-2주)
```
Week 1:
- Day 1-2: 1단계 (Chart 클래스)
- Day 3: 2단계 (Code 에디터)
- Day 4: 3단계 (Modal Redux)
- Day 5: 4단계 (Modal 컴포넌트)

Week 2:
- Day 1: 5단계 (Node 클래스)
- Day 2: 6단계 (테스트 헬퍼)
- Day 3-4: 통합 테스트 및 버그 수정
- Day 5: 문서화 및 PR
```

### 마일스톤
- [ ] Phase 1: Chart 리팩토링 완료
- [ ] Phase 2: Component 리팩토링 완료
- [ ] Phase 3: Test 개선 완료
- [ ] Phase 4: 최종 검증 및 문서화

---

## 📚 참고 자료

### 코드 위치
- Chart 클래스: `src/utils/LineChart.js`, `BarChart.js`, `VariableBarChart.js`
- 컴포넌트: `src/component/`
- Redux: `src/features/`
- 테스트: `tests/unit/`

### 관련 문서
- README.md
- package.json
- 테스트 설정: jest.config.js

---

## ✅ 완료 체크리스트

### 1단계: Chart 클래스
- [ ] BaseChart 생성
- [ ] LineChart 마이그레이션
- [ ] BarChart 마이그레이션
- [ ] VariableBarChart 마이그레이션
- [ ] 테스트 통과

### 2단계: Code 에디터
- [ ] CodeEditor 컴포넌트 생성
- [ ] 기존 컴포넌트 대체
- [ ] 테스트 통과

### 3단계: Modal Redux
- [ ] createModalSlice 팩토리 생성
- [ ] 슬라이스 마이그레이션
- [ ] 테스트 통과

### 4단계: Modal 컴포넌트
- [ ] ModalContainer 생성
- [ ] 기존 모달 대체
- [ ] 테스트 통과

### 5단계: Node 클래스
- [ ] BaseChartNode 생성
- [ ] 노드 클래스 마이그레이션
- [ ] 테스트 통과

### 6단계: 테스트 헬퍼
- [ ] test-helpers 생성
- [ ] 테스트 파일 업데이트
- [ ] 모든 테스트 통과

### 최종 검증
- [ ] 전체 테스트 스위트 통과
- [ ] 수동 UI 테스트 완료
- [ ] 코드 리뷰 완료
- [ ] 문서 업데이트 완료
- [ ] PR 생성 및 머지

---

## 📧 질문 및 이슈
문제가 발생하거나 질문이 있을 경우:
1. GitHub Issues에 등록
2. 리팩토링 계획 재검토
3. 필요시 롤백 후 재계획

---

**문서 버전**: 1.0
**최종 수정일**: 2025-11-06

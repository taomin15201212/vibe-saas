# State Machine Diagrams

This document contains state machine diagrams for components with significant state complexity.

---

## 1. AuthForm State Machine

**Component:** `src/components/AuthForm.tsx`

### State Diagram

```mermaid
stateDiagram-v2
    [*] --> SIGNIN : Initial mode

    SIGNIN : Email/Password Input
    SIGNIN : Sign in button

    SIGNUP : Email/Password Input
    SIGNUP : Register button

    LOADING : Loading spinner
    LOADING : Button disabled

    ERROR : Error message shown
    ERROR : Can retry submit

    SUCCESS : Success message
    SUCCESS : Auto-redirect after 3s

    SIGNIN --> SIGNUP : Toggle mode
    SIGNUP --> SIGNIN : Toggle mode

    SIGNIN --> LOADING : Submit form
    SIGNUP --> LOADING : Submit form

    LOADING --> ERROR : API error
    LOADING --> REDIRECT : Signin success

    LOADING --> SUCCESS : Signup success

    ERROR --> LOADING : Retry submit
    ERROR --> SIGNIN : Clear & toggle
    ERROR --> SIGNUP : Clear & toggle

    SUCCESS --> SIGNIN : 3s timeout

    REDIRECT : Navigate to /dashboard
    REDIRECT --> [*]
```

### State Table

| State | Description | Data |
|-------|-------------|------|
| `SIGNIN` | Sign-in form mode | email, password |
| `SIGNUP` | Sign-up form mode | email, password |
| `LOADING` | Form submission in progress | loading=true |
| `ERROR` | Error message displayed | error message |
| `SUCCESS` | Signup success, waiting to redirect | success message |
| `REDIRECT` | Signin success, navigating | - |

### Transitions

| From | Event | To |
|------|-------|-----|
| SIGNIN/SIGNUP | Toggle mode | SIGNUP/SIGNIN |
| SIGNIN/SIGNUP | Submit form | LOADING |
| LOADING | Signin success | REDIRECT |
| LOADING | Signup success | SUCCESS |
| LOADING | API error | ERROR |
| ERROR | Retry submit | LOADING |
| ERROR | Clear | IDLE mode |
| SUCCESS | 3s timeout | SIGNIN |

---

## 2. DemoPage State Machine

**Component:** `src/app/demo/page.tsx`

### Main State Diagram

```mermaid
stateDiagram-v2
    [*] --> IDLE : Page load

    IDLE : Prompt input visible
    IDLE : No code generated

    LOADING : Generating code...
    LOADING : Prompt input disabled

    RESULT : Code displayed
    RESULT : Live preview visible
    RESULT : Can iterate

    ERROR : Error message shown
    ERROR : Can retry

    IDLE --> LOADING : Submit prompt
    LOADING --> RESULT : Generation success
    LOADING --> ERROR : Generation failed

    ERROR --> LOADING : Retry prompt
    RESULT --> LOADING : New/iterate prompt

    RESULT --> IDLE : Clear all
```

### View Mode Substates (Orthogonal)

```mermaid
stateDiagram-v2
    state RESULT {
        [*] --> SPLIT

        SPLIT : Code + Preview side by side
        SPLIT : grid-cols-2 layout

        CODE : Code only
        CODE : Full width

        PREVIEW : Preview only
        PREVIEW : Full width

        SPLIT --> CODE : setViewMode('code')
        SPLIT --> PREVIEW : setViewMode('preview')
        CODE --> PREVIEW : setViewMode('preview')
        PREVIEW --> SPLIT : setViewMode('split')
    }
```

### Provider Selection (Independent State)

```mermaid
stateDiagram-v2
    [*] --> OPENAI : Default

    OPENAI : OpenAI GPT model
    OPENAI : /api/generate with provider=openai

    ZHIPU : 智谱AI GLM model
    ZHIPU : /api/generate with provider=zhipu

    OPENAI --> ZHIPU : Change provider dropdown
    ZHIPU --> OPENAI : Change provider dropdown
```

### Save State (Transient)

```mermaid
stateDiagram-v2
    [*] --> NOT_SAVED

    NOT_SAVED : Save button active
    NOT_SAVED : Shows "保存记录"

    SAVED : Saved confirmation
    SAVED : Shows "已保存" (green)
    SAVED : Auto-clears after 2s

    NOT_SAVED --> SAVED : handleSave()
    SAVED --> NOT_SAVED : 2s timeout
```

### Complete State Overview

```mermaid
stateDiagram-v2
    classDef mainState fill:#e1f5fe,stroke:#01579b
    classDef transient fill:#fff3e0,stroke:#e65100

    [*] --> IDLE

    IDLE ::: mainState
    LOADING ::: mainState
    RESULT ::: mainState
    ERROR ::: mainState

    IDLE --> LOADING : submit
    LOADING --> RESULT : success
    LOADING --> ERROR : fail
    ERROR --> LOADING : retry
    RESULT --> LOADING : iterate
    RESULT --> IDLE : clear

    state RESULT {
        SPLIT
        CODE
        PREVIEW
    }

    state "Provider" as PROVIDER {
        OPENAI
        ZHIPU
    }

    state "Save Status" as SAVE {
        NOT_SAVED
        SAVED
    }

    RESULT --> PROVIDER : independent
    RESULT --> SAVE : independent
```

### State Table

| State | Description | Data |
|-------|-------------|------|
| `IDLE` | Waiting for user input | prompt="", code="" |
| `LOADING` | AI generating code | isLoading=true |
| `RESULT` | Code displayed, ready for iteration | code, viewMode, saved |
| `ERROR` | Generation failed | error message |

### Sub-States (Orthogonal/Independent)

| Sub-State | Options | Purpose |
|-----------|---------|---------|
| `viewMode` | split, code, preview | Layout control |
| `provider` | openai, zhipu | AI provider selection |
| `saved` | false, true | Save confirmation (transient) |

### Transitions

| From | Event | To |
|------|-------|-----|
| IDLE | Submit prompt | LOADING |
| LOADING | Success | RESULT |
| LOADING | Error | ERROR |
| ERROR | Retry | LOADING |
| RESULT | New/iterate prompt | LOADING |
| RESULT | Clear | IDLE |

---

## Summary

| Component | States | Transitions | Complexity |
|-----------|--------|-------------|------------|
| AuthForm | 5 (+1 transient) | 11 | Medium |
| DemoPage | 4 (+3 sub-states) | 8 (+5 view) | High |

### Complexity Assessment

- **AuthForm**: Medium complexity - Authentication flow with mode switching, loading states, and success/error handling.
- **DemoPage**: High complexity - Multi-step generation workflow with iterative refinement, view modes, provider selection, and save functionality.

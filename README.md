# 화성교통안전체험교육센터 모바일 고객만족도 조사 시스템

교육생이 스마트폰으로 QR코드를 스캔해 설문을 제출하면, 응답이 **구글 스프레드시트에 실시간 자동 저장·집계**되는 화성센터 전용 모바일 설문 시스템입니다.

---

## 📁 폴더 구조

```text
hwaseong-survey/
├── index.html                    # 통합 메인 (개인택시 / 일반·버스·화물 선택)
├── taxi/index.html               # 개인택시 양수교육 만족도 조사 (4단계)
├── general/index.html            # 일반·버스·화물 교육 만족도 조사 (3단계)
├── qr.html                       # 담당자용 QR 포스터 인쇄 & 구글 시트 연동 테스트 도구
├── config.js                     # ⭐ 구글 Apps Script URL 및 교육과정 목록 설정 파일
├── assets/
│   ├── survey.css                # 화성센터 전용 딥 틸/웜 앰버 모바일 UI 스타일
│   └── survey.js                 # 단계별 위자드, 0~10점 버튼 평가 패드, 중복방지 전송 로직
└── google-apps-script/
    └── Code.gs                   # 구글 스프레드시트 저장·집계·진단 스크립트
```

---

## 1부. 새 구글 계정으로 구글 시트 연결하기

### ① 스프레드시트 만들기 & 스크립트 붙여넣기
1. 화성센터 전용 새 구글 계정으로 로그인합니다.
2. 브라우저에서 [https://sheets.new](https://sheets.new) 에 접속해 새 스프레드시트를 만들고 제목을 정합니다.
   - 예: `화성센터 고객만족도 조사 집계`
3. 상단 메뉴 **[확장 프로그램] → [Apps Script]** 클릭
4. 기본 코드(`function myFunction() {}`)를 전부 지우고, 이 폴더의 `google-apps-script/Code.gs` 파일 내용을 **전체 복사해 붙여넣기** 후 저장(`Ctrl + S`)합니다.

### ② 시트 자동 생성 및 내부 테스트
1. 상단 도구모음의 함수 선택창에서 **`setupSheets`** 선택 → **[실행]** 클릭
2. 최초 1회 권한 승인 팝업이 뜨면:
   - **[권한 검토]** → 본인 구글 계정 선택 → 왼쪽 아래 **[고급]** → **[제목 없는 프로젝트(안전하지 않음)로 이동]** → **[허용]**
3. 스프레드시트로 돌아가 보면 **`요약대시보드`**, **`개인택시양수`**, **`일반과정`** 3개 탭이 자동 생성되어 있습니다.
4. *(선택 확인)* 함수 선택창에서 **`testWriteSample`** 을 실행하면 각 시트에 샘플 1건씩 기록되어 수식과 대시보드가 정상 계산되는지 바로 눈으로 확인할 수 있습니다. (확인 후 2행 테스트 데이터는 삭제하세요.)

### ③ 웹 앱 배포 (URL 발급)
1. Apps Script 화면 우측 상단 **[배포] → [새 배포]** 클릭
2. 왼쪽 톱니바퀴(유형 선택) → **[웹 앱]** 선택
3. 아래 두 항목을 정확히 설정합니다:
   - **다음 사용자 권한으로 실행**: `나 (본인 구글 계정)`
   - **액세스 권한이 있는 사용자**: **`모든 사용자`** *(필수! '나만'으로 두면 교육생 제출이 차단됩니다)*
4. **[배포]** 클릭 → 발급된 **웹 앱 URL**(`https://script.google.com/macros/s/.../exec`) 복사
5. 이 폴더의 `config.js` 파일을 메모장으로 열어 `SHEET_URL` 따옴표 안에 붙여넣고 저장합니다.

---

## 2부. GitHub에 올리고 무료 사이트 열기 (상세 순서)

가장 쉬운 **웹 브라우저 업로드 방법** 기준입니다. (별도 프로그램 설치 불필요)

### ① GitHub 가입 및 새 저장소(Repository) 만들기
1. [https://github.com](https://github.com) 에 접속해 로그인(또는 회원가입)합니다.
2. 오른쪽 위 **`+`** 아이콘 클릭 → **`New repository`** 클릭
3. 아래처럼 입력합니다:
   - **Repository name**: `hwaseong-survey` *(원하는 영문 이름 가능)*
   - **Public / Private**: 반드시 **`Public`** 선택 *(무료 GitHub Pages 필수)*
   - 나머지 체크박스는 건드리지 말고 맨 아래 초록색 **`Create repository`** 버튼 클릭

### ② 폴더 파일 업로드하기 (폴더 구조 그대로 유지!)
1. 방금 만든 저장소 화면 가운데에 있는 **`uploading an existing file`** 파란 링크를 클릭합니다.
2. 윈도우 탐색기에서 `c:\Users\서동찬\Desktop\회사\화성센터 메뉴얼\hwaseong-survey` 폴더를 엽니다.
3. **`hwaseong-survey` 폴더 안의 내용물 전체**(`assets`, `general`, `google-apps-script`, `taxi`, `config.js`, `index.html`, `qr.html`, `README.md`)를 `Ctrl + A`로 모두 선택한 뒤, GitHub 브라우저 화면의 **`Drag files here to add them to your repository`** 영역에 한꺼번에 끌어다 놓습니다.
   > ⚠️ **주의**: 바깥쪽 `hwaseong-survey` 폴더 자체를 끌어다 놓으면 주소가 `/hwaseong-survey/hwaseong-survey/`로 중복됩니다. 반드시 **폴더 안의 파일과 하위 폴더들을 선택해서** 끌어다 놓으세요!
4. 모든 파일 업로드가 완료되면 화면 맨 아래 초록색 **`Commit changes`** 버튼을 클릭합니다.
5. 저장소 메인 화면에 `index.html`, `config.js`, `taxi`, `general`, `assets` 등이 보이면 업로드 성공입니다.

### ③ GitHub Pages(웹사이트) 켜기
1. 저장소 상단 탭에서 **[Settings]**(톱니바퀴 아이콘) 클릭
2. 왼쪽 사이드바에서 **[Pages]** 클릭
3. **Build and deployment** 항목에서:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` 선택, 옆 폴더는 `/ (root)` 선택 → **[Save]** 클릭
4. 1~2분 기다린 뒤 페이지를 새로고침하면 맨 위에 초록/회색 박스로 배포 주소가 나타납니다:
   - 통합 메인: `https://<깃허브아이디>.github.io/hwaseong-survey/`
   - 개인택시 전용: `https://<깃허브아이디>.github.io/hwaseong-survey/taxi/`
   - 일반·버스·화물 전용: `https://<깃허브아이디>.github.io/hwaseong-survey/general/`
   - 담당자 QR·연동점검 도구: `https://<깃허브아이디>.github.io/hwaseong-survey/qr.html`

> 💡 **추후 `config.js`만 수정하고 싶을 때**: GitHub 저장소에서 `config.js` 클릭 → 오른쪽 위 **연필 아이콘(Edit)** 클릭 → `SHEET_URL` 붙여넣기 → 오른쪽 위 **`Commit changes`** 클릭하면 1분 내에 사이트에 자동 반영됩니다.

---

## 3부. 구글 시트에 데이터가 제대로 들어가는지 최종 확인하기

1. 배포된 담당자 도구 주소(`https://<깃허브아이디>.github.io/hwaseong-survey/qr.html`)로 접속합니다.
2. 상단 **[구글 시트 연동 상태 실시간 확인]** 카드에서:
   - **`🔍 1. 연결 상태 확인 (Ping)`** 클릭 → 스프레드시트 이름과 시트 3개(`개인택시양수`, `일반과정`, `요약대시보드`) 상태가 초록색으로 표시되는지 확인
   - **`🧪 2. 테스트 데이터 1건 전송`** 클릭 → `✅ 테스트 데이터 저장 성공! (일반과정 #N행)` 메시지 확인
3. 실제 구글 스프레드시트를 열어 `일반과정` 탭 마지막 행에 `[연동테스트]` 행이 들어와 있고, `요약대시보드`의 응답 건수와 평균 점수가 자동 계산되는지 확인합니다.
4. 확인이 끝나면 테스트 행을 삭제하고, `qr.html` 하단에서 **[A4 포스터 인쇄]** 또는 **[QR 이미지(PNG) 저장]**을 눌러 강의실에 바로 적용하시면 됩니다!

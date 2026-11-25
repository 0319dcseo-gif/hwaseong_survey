/**
 * 화성교통안전체험교육센터 고객만족도 조사 설정 파일
 *
 * [최초 설정 방법]
 * 1. 구글 시트에서 Apps Script(google-apps-script/Code.gs)를 웹 앱으로 배포합니다.
 * 2. 발급된 웹 앱 URL(https://script.google.com/macros/s/.../exec)을 아래 SHEET_URL에 붙여넣으세요.
 * 3. 이 파일 하나만 수정하면 개인택시 양수교육 / 일반·버스·화물 교육 설문 모두에 자동 반영됩니다.
 */
window.SURVEY_CONFIG = {
  // ▼ 구글 Apps Script 웹 앱 배포 후 발급된 URL을 따옴표 안에 넣어주세요.
  SHEET_URL: 'https://script.google.com/macros/s/AKfycbzXqMjDVvmzxCdRKc9pmQVzSJDWfHQtMEsTssC8UCD5aHzoclM1WfxGdz0cM5iK_Pit/exec',

  // 센터명
  CENTER_NAME: '화성교통안전체험교육센터',

  // 일반·버스·화물 설문에서 선택할 수 있는 교육과정 목록 (필요 시 자유롭게 추가/수정)
  COURSES: [
    '버스기본교육',
    '버스심화교육',
    '버스자격교육',
    '신규버스운전자 양성교육',
    '일반기본교육',
    '일반심화교육',
    '화물기본교육',
    '화물자격교육',
    '기타(직접입력)'
  ]
};

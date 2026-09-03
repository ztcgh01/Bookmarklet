Bookmarklet Launcher v2

이번 버전은 기본 도구가 0개입니다.
NAI 입력칸 진단 프리셋도 제거되어 있습니다.

GitHub 저장소 루트에서 아래 파일을 기존 파일과 교체하세요.
- index.html
- loader.js
- launcher.html

기존 tools.json / tools 폴더는 더 이상 필요 없습니다.
삭제해도 됩니다.

북마크 URL:
BOOKMARKLET.txt 내용 전체를 URL 칸에 넣으세요.

특징
- 화이트 계열 컴팩트 UI
- 최소화 시 🧃 플로팅 버튼
- 크기 조절
- 도구 추가
- 도구 삭제
- 코드/이름/설명 편집
- ↑ ↓ 순서 변경
- 검색
- 도구 목록은 GitHub Pages origin의 localStorage에 저장
  → 런처가 여러 사이트에서 동일한 저장소를 공유하도록 iframe 구조 사용

주의
- 타깃 사이트의 CSP가 외부 iframe을 막는 경우 해당 사이트에서는 런처가 뜨지 않을 수 있습니다.

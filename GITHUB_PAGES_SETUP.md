# Universal Bookmarklet Launcher

GitHub Pages용 범용 북마클릿 런처입니다.

## 저장소에 올릴 파일

저장소 루트에 이 ZIP의 내용을 그대로 업로드하세요.

```text
/
├─ index.html
├─ launcher.js
├─ tools.json
├─ BOOKMARKLET_LOADER_TEMPLATE.txt
├─ README.txt
└─ tools/
   └─ nai-prompt-diag.js
```

## GitHub Pages 켜기

1. GitHub 저장소를 엽니다.
2. `Settings`
3. 왼쪽 메뉴에서 `Pages`
4. `Build and deployment`
5. Source를 `Deploy from a branch`로 선택
6. Branch는 `main`
7. Folder는 `/(root)`
8. `Save`

잠시 후 Pages 주소가 생깁니다.

예시:

`https://USERNAME.github.io/REPOSITORY/`

그러면 launcher.js 주소는:

`https://USERNAME.github.io/REPOSITORY/launcher.js`

## 북마클릿 만들기

`BOOKMARKLET_LOADER_TEMPLATE.txt`를 열고

`__LAUNCHER_URL__`

부분을 실제 launcher.js 주소로 바꿉니다.

예:

```text
javascript:(()=>{let s=document.createElement('script');s.src='https://USERNAME.github.io/REPOSITORY/launcher.js?v='+Date.now();s.onerror=()=>alert('런처 로드 실패');document.documentElement.appendChild(s)})()
```

이 한 줄을 브라우저 북마크의 URL에 넣으면 됩니다.

## 도구 추가

새 도구 JS 파일을 `tools/`에 추가하고 `tools.json`에 항목을 추가하세요.

예:

```json
{
  "name": "도구 이름",
  "note": "설명",
  "url": "./tools/my-tool.js"
}
```

GitHub Pages가 다시 배포되면 런처에서 바로 새 도구를 불러옵니다.

## 참고

일부 사이트는 CSP 때문에 외부 스크립트 삽입을 차단할 수 있습니다.
그 경우 해당 사이트에서는 이 로더 방식이 동작하지 않을 수 있습니다.

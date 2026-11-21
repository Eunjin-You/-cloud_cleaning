// 각 사물은 독립적으로 클릭할 수 있고, 9개 가상 파일의 삭제량에 따라 조금씩 사라집니다.
const groups = [
  {id:'study', label:'공부', icon:'📚', img:'desk-books.png', main:[1,17,38,49], rotate:-5,
   pieces:[[5,31,18,20,-14],[23,27,16,17,12],[34,49,13,14,15],[12,56,16,16,-9],[40,64,13,12,24],[1,67,14,14,-12],[27,67,14,13,5],[42,35,12,14,-22],[7,47,17,16,5]]},
  {id:'media', label:'사진 · 동영상', icon:'📷', img:'desk-photos.png', main:[37,0,41,42], rotate:3,
   pieces:[[47,5,12,15,-12],[58,12,14,15,8],[72,17,12,14,13],[39,20,12,14,10],[31,39,12,12,-15],[69,40,12,13,-12],[48,46,11,12,18],[82,43,11,12,7],[57,31,12,14,-6]]},
  {id:'assignments', label:'학교 과제', icon:'📄', img:'desk-paper.png', main:[12,47,48,48], rotate:-7,
   pieces:[[3,51,19,17,-16],[21,49,17,18,14],[42,49,17,17,-10],[56,58,18,17,8],[15,70,19,19,13],[33,77,18,16,-7],[49,75,19,18,13],[68,69,17,17,-13],[1,79,16,16,4]]},
  {id:'leisure', label:'유희', icon:'☕', img:'desk-cups.png', main:[60,43,39,45], rotate:4,
   pieces:[[72,46,15,16,12],[86,51,14,17,-10],[63,53,14,16,-18],[76,68,16,17,11],[92,72,13,15,8],[57,75,14,15,-8],[39,69,12,13,14],[81,30,13,14,-12],[5,59,13,15,15]]},
];
const fragmentClip = ['polygon(5% 18%,82% 5%,96% 71%,62% 96%,11% 89%)','polygon(18% 4%,94% 15%,86% 94%,5% 80%)','polygon(10% 9%,89% 8%,97% 76%,72% 94%,7% 91%)'];
export function deskScene(progress={}) {
  let main='', pieces='';
  for (const g of groups) {
    const p=Math.max(0,Math.min(1,Number(progress[g.id])||0));
    const remaining=Math.max(0,9-Math.round(p*9));
    const [left,top,width,height]=g.main;
    const shrink=(1-.58*p).toFixed(3);
    // 큰 더미도 각 삭제마다 감소해 4단계 사이의 변화가 분명합니다.
    if(remaining>0) main+=`<button type="button" class="desk-object desk-main" data-category="${g.id}" aria-label="${g.label} 파일 열기" style="left:${left}%;top:${top}%;width:${width}%;height:${height}%;z-index:2"><img src="./${g.img}" style="transform:scale(${shrink}) rotate(${g.rotate}deg)" alt=""><span class="desk-tooltip">${g.icon} ${g.label}</span></button>`;
    g.pieces.slice(0,remaining).forEach(([x,y,w,h,angle],i)=>{
      pieces+=`<button type="button" class="desk-object desk-fragment" data-category="${g.id}" aria-label="${g.label} 파일 열기" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%;z-index:${3+i%3}"><img src="./${g.img}" style="clip-path:${fragmentClip[(i+g.id.length)%fragmentClip.length]};transform:rotate(${angle}deg)" alt=""><span class="desk-tooltip">${g.icon} ${g.label}</span></button>`;
    });
  }
  return `<div class="real-desk" role="group" aria-label="책상. 정리할 물건을 선택하세요."><style>
  .real-desk{position:relative;width:100%;height:100%;min-height:0;overflow:hidden;background:#d0b698 url('./desk-background.png') center / cover no-repeat;isolation:isolate;}
  .real-desk .desk-object{position:absolute;display:block;padding:0;border:0;background:transparent;cursor:pointer;overflow:visible;transition:filter .2s;}
  .real-desk .desk-object:hover,.real-desk .desk-object:focus-visible{filter:brightness(1.09) drop-shadow(0 0 7px #fff9d0);outline:none;z-index:20!important}
  .real-desk .desk-object img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;pointer-events:none;filter:drop-shadow(0 5px 4px #38261c70);}
  .real-desk .desk-fragment img{filter:drop-shadow(1px 4px 4px #38261c65);}
  .real-desk .desk-tooltip{position:absolute;left:50%;top:8%;z-index:30;transform:translate(-50%,-85%);white-space:nowrap;pointer-events:none;border:1px solid #fff9;padding:8px 12px;background:#fffef4f5;color:#3c3028;border-radius:100px;font:700 13px/1.2 system-ui,sans-serif;box-shadow:0 3px 18px #3e241f50;opacity:0;visibility:hidden;transition:opacity .15s,transform .15s;}
  .real-desk .desk-object:hover .desk-tooltip,.real-desk .desk-object:focus-visible .desk-tooltip{opacity:1;visibility:visible;transform:translate(-50%,-100%)}
  @media(max-width:700px){.real-desk .desk-tooltip{font-size:11px;padding:7px 9px}}
  </style>${main}${pieces}</div>`;
}

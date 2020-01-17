let _compData = {
  '_toast_.isHide':false,
  '_toast_.icon':'',
  '_toast_.content':''
}
let toastPannel = {
  noHideShow: function (icon,content){
    let self = this;
    this.setData({ '_toast_.isHide': true, '_toast_.icon': icon, '_toast_.content': content});
    setTimeout(function(){
      self.setData({'_toast_.isHide':false})
    },30000)
  }
}
function ToastPannel(){
  let pages = getCurrentPages();
  let curPage = pages[pages.length-1];
  this._page = curPage;
  Object.assign(curPage,toastPannel);
  curPage.toastPannel = this;
  curPage.setData(_compData);
  return this;
}
module.exports = {
  ToastPannel
}
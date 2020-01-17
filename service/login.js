let Ajax = require('./ajax.js')

module.exports = class login extends Ajax {
  /**
   * 检测是否登录接口
   * js_code
   */
  logininit(data) {
    super.post({
      url: "b2dmao/login.jhtml",
      data: data
    });
  }


  /**
   * 提交登录
   * username
   * enPassword
   */
  submit(data) {
    super.post({
      url: "b2dmao/login/submit.jhtml",
      data: data
    });
  }



  /**
   * 退出登录
   */
  quitLogin(data) {
    super.post({
      url: "b2dmao/logout.jhtml",
      data: data
    });
  }

  /**
   * 忘记密码发送验证
   */
  getCheckCode(data) {
    super.post({
      url: "b2dmao/login/getCheckCode.jhtml",
      data: data
    });
  }

  /**
   * 检查送验证
   */
  check_mobile(data) {
    super.post({
      url: "b2dmao/login/check_mobile.jhtml",
      data: data
    });
  }


  reset(data) {
    super.post({
      url: "b2dmao/login/reset.jhtml",
      data: data
    });
  }
}
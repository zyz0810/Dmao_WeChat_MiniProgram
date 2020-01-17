let Ajax = require('./ajax.js')

module.exports = class Product extends Ajax {

  /**
   * 商品详情
   * id 商品Id
   */
  view(data) {
    super.get({
      url: 'applet/product/view.jhtml',
      data: data

    });
  }

  /**
   * 商品详情页分享
   * id 商品Id
   */
  share(data) {
    super.get({
      url: 'applet/product/share.jhtml',
      data: data

    });
  }

  /**
   * 获取指定商家的商品列表
   * id 商家编号
   * productCategoryTenantId 商家分类 id
   * keyword 搜索关键词
   * tagIds 商品签标(2新品,5推荐,1热销)
   * brandId 品牌
   * startPrice endPrice 介位段
   * orderType 排序 {综合排序 weight,置顶降序 topDesc, 价格升序 priceAsc,价格降序 priceDesc,销量降序 salesDesc,评分降序 scoreDesc, 日期降序 dateDesc,人气降序 hitsDesc}
   */
  listT(data) {
    super.get({
      url: 'applet/product/list/' + data.id + '.jhtml',
      data: data
    })
  }

  /**
   * 商家促销商品
   * tenantId 商家Id
   * location 经纬度
   * pageable 分页
   */
  promotionList(data) {
    super.get({
      url: 'applet/product/promotion/list.jhtml',
      data: data

    });
  }
  /**
   * 邻家好货，指联盟商品的商品
   * id 商家Id
   */
  unions(data) {
    super.get({
      url: 'applet/product/unions.jhtml',
      data: data

    });
  }
  /**
   * 获取推荐，搭配商品列表
   * id 商品Id
   */
  recommend(data) {
    super.get({
      url: 'applet/product/recommend.jhtml',
      data: data

    });
  }
  /**
   * 商品热门搜索词
   */
  hot_search() {
    super.get({
      url: 'applet/product/hot_search.jhtml'

    });
  }
  /**
   * 添加商品到收藏
   * id 商品Id
   */
  favorite(data) {
    super.post({
      url: 'applet/member/favorite/product/add.jhtml',
      data: data
    })
  }
  /**
   * 取消商品收藏
   * id 商品Id
   */
  delFavorite(data) {
    super.post({
      url: 'applet/member/favorite/product/delete.jhtml',
      data: data
    })
  }



  /**
   * 搭配销售
   * id 商品Id
   */
  tieinsale(data) {
    super.get({
      url: 'applet/product/tieinsale.jhtml',
      data: data

    });
  }

  /**
   * 获取推荐，搭配商品列表
   * id 商品Id
   */
  recommend(data) {
    super.get({
      url: 'applet/product/recommend.jhtml',
      data: data
    });
  }

  /**
   * 货架商品
   *  货架号:shelvesNo
   * 商家id :tenantId
   */
  shelvesList(data) {
    super.get({
      url: 'applet/productShelves/list.jhtml',
      data: data
    });
  }

  /**
* 商品访问记录
* 商家id :tenantId
* 商品id：productId
* visitType   访问类型  (无线网wifi,C端app,购物屏pad,微信weixin)
* machineType 设备类型  (手机mobile,平板pad,电脑pc)
*/
  record(data) {
    super.post({
      url: 'weixin/visitRecord/add.jhtml',
      data: data
    });
  }

  /**
  * 商品分享码获取
  * 商家id :tenantId
  * 商品id：productId
  */
  code(data) {
    super.get({
      url: 'applet/productShelves/code.jhtml',
      hideErrorTip: true,
      data: data
    });
  }



}
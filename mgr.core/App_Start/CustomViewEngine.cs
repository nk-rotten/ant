using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Text.Encodings.Web;
using Configuration;
using DbModel;
using Infrastructure.StaticExt;
using Infrastructure.Web;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using Microsoft.AspNetCore.Razor.Language;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Repository.Interface;
using ServicesModel;

namespace ant.mgr.core
{
    public class MenuHeaderViewComponent : ViewComponent
    {
        private readonly IMenuRespository MenuRespository;
        private readonly IAccountRespository AccountRespository;

        public MenuHeaderViewComponent(IMenuRespository _menuRespository, IAccountRespository _accountRespository)
        {
            MenuRespository = _menuRespository;
            AccountRespository = _accountRespository;
        }

        public IViewComponentResult Invoke()
        {
            //检查是否登录
            //从cookie 拿到token
            var token = CodingUtils.AesDecrypt(WebUtils.GetCookie(GlobalSetting.CurrentLoginUserGuid));
            if (string.IsNullOrEmpty(token))
            {
                return Content(string.Empty);
            }

            try
            {
                var tokenObj = new Token(token);
                SystemUsers systemUser = AccountRespository.Entity.FirstOrDefault(r => r.Eid.Equals(tokenObj.Eid));
                if (systemUser == null || !systemUser.IsActive)
                {
                    return Content(string.Empty);
                }

                var menuList = MenuRespository.GetAllRightsMenus(systemUser.Eid, systemUser.MenuRights);
                ////拼接Menu
                var html = RenderMenu(menuList);
                return new HtmlContentViewComponentResult(new HtmlString(html));
            }
            catch (Exception)
            {
                return Content(string.Empty);
            }

        }



        #region Private

        /// <summary>
        /// 绘制Menu
        /// </summary>
        /// <param name="menuList"></param>
        /// <returns></returns>
        private string RenderMenu(List<SystemMenuSM> menuList)
        {
            
            StringBuilder sb = new StringBuilder();
            foreach (var mu in menuList)
            {
                if (mu.ChildMunuList.Count == 0)
                {
                    //只有一层
                    sb.AppendLine("<el-menu-item index=\"" + mu.Tid + "\" v-on:click=\"addTab('" + mu.Tid + "', '" + mu.Name + "', '" + mu.Url + "')\">");
                    sb.AppendLine("<i class=\"" + mu.Class + "\"></i>");
                    sb.AppendLine("<span slot=\"title\">" + mu.Name + "</span>");
                    sb.AppendLine("</el-menu-item>");
                }
                else
                {
                    sb.AppendLine("<el-submenu index=\""+mu.Tid+"\">");
                    sb.AppendLine("<template slot=\"title\">");
                    sb.AppendLine(" <i class=\""+mu.Class+"\"></i>");
                    sb.AppendLine("<span slot=\"title\">"+mu.Name+"</span>");
                    sb.AppendLine("</template>");
                    foreach (var child2 in mu.ChildMunuList)
                    {
                        sb.AppendLine("<el-menu-item index=\"" + child2.Tid + "\" v-on:click=\"addTab('" + child2.Tid + "', '" + child2.Name + "', '" + child2.Url + "')\">");
                        sb.AppendLine("<i class=\"" + child2.Class + "\"></i>");
                        sb.AppendLine("<span slot=\"title\">" + child2.Name + "</span>");
                        sb.AppendLine("</el-menu-item>");
                    }

                    sb.AppendLine("</el-submenu>");
                }
            }
            return sb.ToString();
        }
        #endregion
    }
}
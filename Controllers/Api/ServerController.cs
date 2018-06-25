using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using AZimpleWeb.Models;
using AZimpleWeb.Services;

namespace AZimpleWeb.Controllers
{
    [Route("api/[controller]")]
    public class ServerController : Controller
    {
        [HttpGet("[action]")]
        public ActionResult Realms()
        {
            AuthService context = HttpContext.RequestServices.GetService(typeof(AuthService)) as AuthService;
            List<RealmInfo> realms = context.GetRealmList();
            return new OkObjectResult(realms);
        }

        [HttpGet("[action]/{id}/Count")]
        public ActionResult Realm(int id)
        {
            AuthService context = HttpContext.RequestServices.GetService(typeof(AuthService)) as AuthService;
            RealmInfo realm = context.GetRealm(id);
            long allianceCount = realm.GetFactionOnlinePlayersCount(Faction.ALLIANCE);
            long hordeCount = realm.GetFactionOnlinePlayersCount(Faction.HORDE);
            long totalCount = realm.GetOnlinePlayersCount();
            
            return new OkObjectResult(new { allianceCount = allianceCount, hordeCount = hordeCount, totalCount = totalCount });
        }
    }
}
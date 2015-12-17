using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Cobbler.Web.Startup))]
namespace Cobbler.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}

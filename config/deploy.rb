set :application, "jsconf"
set :repository,  "git://github.com/voodootikigod/jsconfus.git"
set :user, "deploy"
set :deploy_to, "/sites/#{application}"
set :use_sudo, false
set :scm, :git


role :web, "jsconf.us"
role :app, "jsconf.us"
role :db,  "jsconf.us"

namespace :deploy do
  task :start {}
  task :stop {}
  task :restart, :roles => :app, :except => { :no_release => true } do
    
  end
end
use git2::{opts, Repository, StatusOptions};
use std::path::{Path, PathBuf};
use std::fs;


pub fn is_git_repository(path:&str)->bool
{
    let git_path = Path::new(path).join(".git");
    git_path.exists() && (git_path.is_dir()||git_path.is_file())
}

pub fn has_commits(path: &str)->bool 
{
    match Repository::open(path) {
        Ok(repo)=> {
            match  repo.head() 
            {
                Ok(_)=>true, //head exist = has commits 

                Err(_)=>false,
            }
        }
        Err(_) => false,
    }
}

pub fn has_uncommitted_changes(path:&str)->bool
{
    match Respository::open(path)
    {
        Ok(repo) => 
        {
            let mut opts = StatusOptions::new();
            opts.include_untracked(true);
            opts.recurse_untracked_dirs(true);

            match repo.statuses(Some(&mut opts))
            {
                Ok(statuses) => {
                    !statuses.is_empty()
                }
                Err(_)=>false;
            }
        }

        Err(_) => false,
    }
}


pub fn get_git_status(path: &str)->GitStatus 
{
    GitStatus {
        is_repo: is_git_repository(path),
        has_commits: has_commits(path),
        has_changes:has_uncommitted_changes(path),
    }
}




#[derive(Debug, Clone, serde::Serialize)]
pub struct GitStatus 
{
    pub is_repo:bool,
    pub has_commits: bool,
    pub has_changes: bool,
}

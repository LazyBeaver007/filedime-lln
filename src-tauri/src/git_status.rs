use filesize::file_real_size_fast;
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
    match Repository::open(path)
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
                Err(_)=>false,
            }
        }

        Err(_) => false,
    }
}


pub fn get_git_status(path: &str)->GitStatus 
{
    // attempt to read some git metadata (branch, remote, last commit)
    let mut branch: Option<String> = None;
    let mut remote: Option<String> = None;
    let mut last_commit: Option<String> = None;

    if let Ok(repo) = Repository::open(path) {
        // branch / HEAD
        if let Ok(head) = repo.head() {
            if let Some(name) = head.shorthand() {
                branch = Some(name.to_string());
            }
            if let Ok(peeled) = head.peel_to_commit() {
                last_commit = Some(peeled.id().to_string());
            }
        }

        // remote (pick first remote if any)
        if let Ok(remotes) = repo.remotes() {
            if let Some(first) = remotes.get(0) {
                if let Ok(rm) = repo.find_remote(first) {
                    if let Some(url) = rm.url() {
                        remote = Some(url.to_string());
                    }
                }
            }
        }
    }

    GitStatus {
        is_repo: is_git_repository(path),
        has_commits: has_commits(path),
        has_changes:has_uncommitted_changes(path),
        branch,
        remote,
        last_commit,
    }
}




#[derive(Debug, Clone, serde::Serialize)]
pub struct GitStatus 
{
    pub is_repo:bool,
    pub has_commits: bool,
    pub has_changes: bool,
    pub branch: Option<String>,
    pub remote: Option<String>,
    pub last_commit: Option<String>,
}

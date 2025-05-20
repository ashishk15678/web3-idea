use std::env;

pub fn log(msg: &str) {
    if env::var("APP_ENV").unwrap_or_default() == "dev" {
        println!("{}", msg);
    }
}

pub fn info(message: &str) {
    println!("[INFO] {}", message);
}

pub fn route_log(method: &str, path: &str, params: Option<&str>) {
    let params_str = params.map_or("".to_string(), |p| format!(" with params: {}", p));
    info(&format!("{} {} {}", method, path, params_str));
}

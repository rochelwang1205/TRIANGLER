import React from 'react';

export function Login({ show, onClose }) {
    if (!show) return null;

    const handleBackdropClick = (e) => {
        // 確保點擊的是最外層 modal 而不是其子元素
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
  
    return (
        <>
            <div 
                className={`modal fade show`} 
                style={{ display: 'block' }} 
                tabIndex="-1"
                onClick={handleBackdropClick}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content container">
                        <div className="modal-header ">
                            <h5 className="modal-title">登入</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        <div className="text-center my-2">
                            <p className="m-0">還沒有帳號？<a href="/register" className="text-dark">立即註冊</a></p>
                        </div>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">電子信箱</label>
                                    <input type="email" className="form-control" id="email" placeholder="請輸入電子信箱" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">密碼</label>
                                    <input type="password" className="form-control" id="password" placeholder="請輸入密碼" />
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="remember" />
                                        <label className="form-check-label" htmlFor="remember">記住我</label>
                                    </div>
                                    <a href="/forgot-password" className="text-decoration-none">忘記密碼？</a>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">登入</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
}
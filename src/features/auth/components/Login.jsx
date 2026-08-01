import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalOverlay from '@/components/ModalOverlay';
import { FaFacebook, FaGoogle, FaApple } from 'react-icons/fa';
import { MdArrowBack } from 'react-icons/md';
import { api } from '@/lib/api/api';
import { DEMO_ACCOUNT, DEMO_PASSWORD } from '../constants/demoAuth';
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  forgotAccountSchema,
} from '@/lib/validation/schemas';

function FieldError({ message }) {
  return message ? <p className="auth-error">{message}</p> : null;
}

export function Login({ show, onClose, onRegister, onForgotPassword, onSuccess }) {
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { account: DEMO_ACCOUNT, password: DEMO_PASSWORD },
  });

  useEffect(() => {
    if (show) {
      reset({ account: DEMO_ACCOUNT, password: DEMO_PASSWORD });
      setError(null);
    }
  }, [show, reset]);

  const onSubmit = async ({ account, password }) => {
    setError(null);
    setVerifying(true);
    try {
      const data = await api.login(account, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onSuccess?.(data.user);
      onClose();
    } catch {
      setError('登入失敗，帳號或密碼錯誤');
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <ModalOverlay show={show} onClose={() => {}}>
        <div className="auth-modal auth-modal--simple auth-modal--center">
          <h5>登入驗證中...</h5>
        </div>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay show={show} onClose={onClose}>
      <div className="auth-modal">
        <div className="auth-modal__header">
          <h5>登入</h5>
          <p>
            還沒有帳號？
            <button type="button" className="auth-link" onClick={onRegister}>立即註冊</button>
          </p>
        </div>
        <form className="auth-modal__form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="auth-field">
            <input
              type="text"
              id="login-account"
              placeholder=" "
              autoComplete="off"
              data-lpignore="true"
              data-1p-ignore
              {...register('account')}
            />
            <label htmlFor="login-account">帳號</label>
          </div>
          <FieldError message={errors.account?.message} />
          <div className="auth-field">
            <input
              type="password"
              id="login-password"
              placeholder=" "
              autoComplete="new-password"
              data-lpignore="true"
              data-1p-ignore
              {...register('password')}
            />
            <label htmlFor="login-password">密碼</label>
          </div>
          <FieldError message={errors.password?.message} />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn-yellow btn-yellow--full">登入</button>
          <button type="button" className="auth-link auth-link--center" onClick={onForgotPassword}>
            忘記帳號/忘記密碼
          </button>
        </form>
        <div className="auth-modal__social">
          <p>快速登入</p>
          <div className="auth-modal__social-icons">
            <button type="button" aria-label="Facebook 登入"><FaFacebook size={28} color="#1877F2" /></button>
            <button type="button" aria-label="Google 登入"><FaGoogle size={28} color="#DB4437" /></button>
            <button type="button" aria-label="Apple 登入"><FaApple size={28} color="#000" /></button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}

export function Register({ show, onClose, onLogin, onSuccess }) {
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { account: '', password: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (show) {
      reset({ account: '', password: '', confirmPassword: '' });
      setError(null);
      setSuccess(false);
    }
  }, [show, reset]);

  const onSubmit = async ({ account, password, confirmPassword }) => {
    setError(null);
    setVerifying(true);
    try {
      const data = await api.register(account, password, confirmPassword);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setSuccess(true);
      onSuccess?.(data.user);
    } catch (err) {
      setError(err.message === '帳號已存在' ? '重複註冊，此帳號已被使用' : err.message);
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <ModalOverlay show={show} onClose={() => {}}>
        <div className="auth-modal auth-modal--simple auth-modal--center">
          <h5>註冊驗證中...</h5>
        </div>
      </ModalOverlay>
    );
  }

  if (success) {
    return (
      <ModalOverlay show={show} onClose={onClose}>
        <div className="auth-modal auth-modal--simple auth-modal--center">
          <h5>註冊成功！</h5>
        </div>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay show={show} onClose={onClose}>
      <div className="auth-modal">
        <div className="auth-modal__header">
          <h5>註冊</h5>
          <p>
            已經有帳號了？
            <button type="button" className="auth-link" onClick={onLogin}>立即登入</button>
          </p>
        </div>
        <form className="auth-modal__form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="auth-field">
            <input type="text" id="reg-account" placeholder=" " autoComplete="off" data-lpignore="true" {...register('account')} />
            <label htmlFor="reg-account">帳號</label>
          </div>
          <FieldError message={errors.account?.message} />
          <div className="auth-field">
            <input type="password" id="reg-password" placeholder=" " autoComplete="new-password" data-lpignore="true" {...register('password')} />
            <label htmlFor="reg-password">密碼</label>
          </div>
          <FieldError message={errors.password?.message} />
          <div className="auth-field">
            <input type="password" id="reg-confirm" placeholder=" " autoComplete="new-password" data-lpignore="true" {...register('confirmPassword')} />
            <label htmlFor="reg-confirm">再輸入密碼</label>
          </div>
          <FieldError message={errors.confirmPassword?.message} />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn-yellow btn-yellow--full">註冊</button>
        </form>
        <div className="auth-modal__social">
          <p>快速註冊</p>
          <div className="auth-modal__social-icons">
            <button type="button" aria-label="Facebook 註冊"><FaFacebook size={28} color="#1877F2" /></button>
            <button type="button" aria-label="Google 註冊"><FaGoogle size={28} color="#DB4437" /></button>
            <button type="button" aria-label="Apple 註冊"><FaApple size={28} color="#000" /></button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}

export function ForgotPassword({ show, onClose, onBack, onSent }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotAccountSchema),
    defaultValues: { account: '' },
  });

  useEffect(() => {
    if (show) reset({ account: '' });
  }, [show, reset]);

  const onSubmit = ({ account }) => {
    onSent?.(account);
  };

  return (
    <ModalOverlay show={show} onClose={onClose}>
      <div className="auth-modal auth-modal--simple">
        <button type="button" className="auth-back" onClick={onBack}>
          <MdArrowBack size={16} /> 返回登入頁
        </button>
        <h5>忘記密碼</h5>
        <form className="auth-modal__form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="auth-field">
            <input type="text" id="forgot-account" placeholder=" " autoComplete="off" data-lpignore="true" {...register('account')} />
            <label htmlFor="forgot-account">帳號</label>
          </div>
          <FieldError message={errors.account?.message} />
          <button type="submit" className="btn-yellow btn-yellow--full">發送驗證信</button>
        </form>
      </div>
    </ModalOverlay>
  );
}

export function ResetPassword({ show, onClose, onComplete, account: initialAccount = '' }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (show) {
      reset({ password: '', confirmPassword: '' });
      setError(null);
    }
  }, [show, reset]);

  const onSubmit = async ({ password, confirmPassword }) => {
    setError(null);
    setLoading(true);
    try {
      await api.resetPassword(initialAccount, password, confirmPassword);
      onComplete?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay show={show} onClose={onClose}>
      <div className="auth-modal auth-modal--simple">
        <h5>重設密碼</h5>
        <form className="auth-modal__form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="auth-field">
            <input type="password" id="reset-password" placeholder=" " autoComplete="new-password" data-lpignore="true" {...register('password')} />
            <label htmlFor="reset-password">新密碼</label>
          </div>
          <FieldError message={errors.password?.message} />
          <div className="auth-field">
            <input type="password" id="reset-confirm" placeholder=" " autoComplete="new-password" data-lpignore="true" {...register('confirmPassword')} />
            <label htmlFor="reset-confirm">再輸入新密碼</label>
          </div>
          <FieldError message={errors.confirmPassword?.message} />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn-yellow btn-yellow--full" disabled={loading}>
            {loading ? '處理中...' : '完成'}
          </button>
        </form>
      </div>
    </ModalOverlay>
  );
}

export function ResetSuccess({ show, onClose, onLogin }) {
  return (
    <ModalOverlay show={show} onClose={onClose}>
      <div className="auth-modal auth-modal--simple auth-modal--center">
        <h5>重設密碼成功！</h5>
        <button type="button" className="btn-yellow btn-yellow--full" onClick={onLogin}>立即重新登入</button>
      </div>
    </ModalOverlay>
  );
}

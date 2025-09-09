import { useRef, useEffect, useCallback } from 'react';
import { Input, Button, Form } from '@/components';
import { Helmet } from 'react-helmet-async';
import styles from '@/styles/pages/Login.module.scss';
import { NavLink, useNavigate } from 'react-router-dom';
import { validatePassword, validateEmail } from './../api/validation';
import useUserStore from '@/stores/userStore';
import { useLoginForm } from './../hooks/useLoginForm';
import { getAuthToken } from '@/utils/getAuthToken';

function LoginPage() {
  const { login } = useUserStore();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const [state, dispatch] = useLoginForm();

  const handleEmailChange = useCallback(
    (e) => {
      dispatch({ type: 'SET_EMAIL', payload: e.target.value });
    },
    [dispatch]
  );

  const handlePasswordChange = useCallback(
    (e) => {
      dispatch({ type: 'SET_PASSWORD', payload: e.target.value });
    },
    [dispatch]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;

      if (name === 'email' && !validateEmail(value)) {
        dispatch({
          type: 'SET_WARNING',
          payload: { email: '유효한 이메일 주소를 입력하세요.' },
        });
      } else if (name === 'password' && !validatePassword(value)) {
        dispatch({
          type: 'SET_WARNING',
          payload: {
            password: '비밀번호는 영문자, 숫자, 특수문자를 포함하여 최소 8자 이상 입력해야 합니다.',
          },
        });
      } else {
        dispatch({
          type: 'SET_WARNING',
          payload: { [name]: '' },
        });
      }
    },
    [dispatch]
  );

  const handleLogin = async (e) => {
    e.preventDefault();

    if (state.isSubmitting) return;

    if (!state.email) {
      emailRef.current.focus();

      dispatch({
        type: 'SET_WARNING',
        payload: { email: '이메일을 입력하세요.' },
      });
      return;
    }

    if (!state.password) {
      passwordRef.current.focus();

      dispatch({
        type: 'SET_WARNING',
        payload: { password: '비밀번호를 입력하세요.' },
      });
      return;
    }

    try {
      dispatch({ type: 'SET_SUBMITTING', payload: true });

      const result = await login(state.email, state.password);

      if (result.success) {
        navigate('/main', { replace: true });
      }
    } catch (error) {
      console.error('로그인 실패:', error);

      dispatch({
        type: 'SET_WARNING',
        payload: { auth: '이메일 또는 비밀번호를 확인해주세요.' },
      });
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  };

  const toggleShowPassword = () => {
    dispatch({ type: 'TOGGLE_PASSWORD' });
  };

  useEffect(() => {
    const token = getAuthToken();

    if (token) {
      navigate('/main', { replace: true });
    }
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>로그인 | StyleCast - 나만의 스타일 캐스트</title>
        <meta property="og:title" content="로그인 | StyleCast - 나만의 스타일 캐스트" />
        <meta property="twitter:title" content="로그인 | StyleCast - 나만의 스타일 캐스트" />
        <meta name="description" content="날씨에 따른 옷차림을 추천해주는 StyleCast" />
        <meta property="og:description" content="날씨에 따른 옷차림을 추천해주는 StyleCast" />
        <meta
          name="keywords"
          content="날씨, 기온, 옷차림, 뭐입지, 입을옷, 의류, 기상정보, 룩북, 체형, 퍼스널컬러"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://stylecast.netlify.app/image/og-sc.png" />
        <meta property="og:url" content="https://stylecast.netlify.app/" />
        <meta property="og:site:author" content="TopTen" />
        <link rel="canonical" href="https://stylecast.netlify.app/login" />
      </Helmet>

      <div className="wrapComponent">
        <div className={styles['top__title']}>
          <h2 className={styles['top__title--big']}>
            스타일 캐스트에
            <br />
            오신 것을 환영해요!
          </h2>
          <p className={styles['top__title--sm']}>
            스타일 캐스트가 처음이시라면
            <br />
            회원가입을 하시고
            <br />
            나에게 맞는 맞춤 추천을 받으세요.
          </p>
        </div>

        <Form onSubmit={handleLogin} aria-busy={state.isSubmitting} className={styles.loginForm}>
          <Input
            text="이메일"
            description="이메일을 입력하세요"
            name="email"
            value={state.email}
            inputRef={emailRef}
            onChange={handleEmailChange}
            onBlur={handleBlur}
            warningText={state.warnings.email || state.warnings.auth}
          />
          <Input
            text="비밀번호"
            description="비밀번호를 입력하세요"
            name="password"
            type={state.showPassword ? 'text' : 'password'}
            value={state.password}
            inputRef={passwordRef}
            onChange={handlePasswordChange}
            onBlur={handleBlur}
            warningText={state.warnings.password || state.warnings.auth}
          />
          <div className={styles.showPasswordWrap}>
            <input
              type="checkbox"
              id="showPassword"
              checked={state.showPassword}
              onChange={toggleShowPassword}
            />
            <label htmlFor="showPassword">비밀번호 보기</label>
          </div>
          <div className={styles.buttonArea}>
            <Button
              type="submit"
              text={state.isSubmitting ? '로그인 진행 중' : '로그인'}
              disabled={state.isSubmitting}
              active={!state.isSubmitting}
            />
          </div>
        </Form>

        <div className={styles.joinGroup}>
          <NavLink to="/findpassword">비밀번호 찾기</NavLink>
          <span aria-hidden="true" className={styles.distinguished}>
            |
          </span>
          <NavLink to="/register">회원가입</NavLink>
        </div>
      </div>
    </>
  );
}

export default LoginPage;

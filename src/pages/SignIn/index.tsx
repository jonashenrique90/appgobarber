import React, { useCallback, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { View, ScrollView, Image, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/auth';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { Container, Title, ForgotPassword, ForgotPasswordText, CreateAccountButton, CreateAccountButtonText } from './styles';
import getValidationsErros from '../../utils/getValidationsErrors';
import logoImg from '../../assets/logo.png';
import Input from '../../components/Input';
import Button from '../../components/Button';

interface SignInFormData {
	email: string;
	password: string;
}

const SignIn: React.FC = () => {
	const navigation = useNavigation();
	const { signIn } = useAuth();

	const formRef = useRef<FormHandles>(null);
	const passwordInputRef = useRef<TextInput>(null);
	const handleSignIn = useCallback(async (data: SignInFormData) => {
		try {
			formRef.current?.setErrors({});
			const schema = Yup.object().shape({
				email: Yup.string().required('E-mail Obrigatório').email('Digite um e-mail válido'),
				password: Yup.string().required('Senha Obrigatória'),

			});
			await schema.validate(data, { abortEarly: false });
			await signIn({
				email: data.email,
				password: data.password,
			});

		} catch (err) {
			if (err instanceof Yup.ValidationError) {
				const errors = getValidationsErros(err);
				formRef.current?.setErrors(errors);
				return;
			}

			Alert.alert('Erro na autenticação', 'Ocorreu erro ao fazer Login, cheque as credenciais.');
		}
	}, [signIn]);
	return (
		<>
			<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
				<ScrollView contentContainerStyle={{ flex: 1 }} keyboardShouldPersistTaps="handled">
					<Container>
						<Image source={logoImg} />
						<View>
							<Title>Faça seu logon</Title>
						</View>
						<Form style={{ width: '100%' }} ref={formRef} onSubmit={handleSignIn}>
							<Input
								autoCapitalize="none"
								autoCorrect={false}
								keyboardType="email-address"
								returnKeyType="next"
								name="email" icon="mail"
								placeholder="E-mail"
								onSubmitEditing={() => { passwordInputRef.current?.focus() }}
							/>
							<Input
								ref={passwordInputRef}
								secureTextEntry
								returnKeyType="send"
								onSubmitEditing={() => { formRef.current?.submitForm() }}
								name="password" icon="lock"
								placeholder="Senha"
							/>
							<Button onPress={() => { formRef.current?.submitForm() }}>Entrar</Button>
						</Form>
						<ForgotPassword onPress={() => { }}>
							<ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
						</ForgotPassword>
					</Container>
				</ScrollView>
			</KeyboardAvoidingView>
			<CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
				<Icon name="log-in" size={20} color="#ff9000" />
				<CreateAccountButtonText>Criar uma Conta</CreateAccountButtonText>
			</CreateAccountButton>
		</>
	);
}


export default SignIn;

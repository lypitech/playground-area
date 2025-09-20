import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:go_router/go_router.dart';
import 'package:test_flutter/widget/custom_text_field.dart';

class LoginPage extends StatefulWidget {

  const LoginPage({ super.key });

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {

  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  void _signin() {
    // ...
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Welcome back!',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                    fontWeight: FontWeight.bold
                ),
              ),
              Gap(40),
              Form(
                  key: _formKey,
                  child: ConstrainedBox(
                    constraints: BoxConstraints(
                        maxWidth: 350
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        CustomTextField(
                          title: 'E-mail',
                          controller: _emailController,
                          prefixIcon: Icons.email_rounded,
                          keyboardType: TextInputType.emailAddress,
                          autofocus: true,
                          validator: (String? value) {
                            return null;
                          },
                          hint: 'john.doe@example.com',
                          onValidation: (_) => _signin(),
                        ),
                        Gap(20),
                        CustomTextField(
                          title: 'Password',
                          controller: _passwordController,
                          prefixIcon: Icons.lock_rounded,
                          onValidation: (_) => _signin(),
                          obscureText: true,
                        ),
                        Gap(20),
                        ElevatedButton(
                            onPressed: () => _signin(),
                            child: Text('Sign In')
                        ),
                        Gap(20),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            Text('Don\'t have an account?'),
                            Gap(5),
                            TextButton(
                                onPressed: () {
                                  context.go('/signup');
                                },
                                child: Text(
                                  'Sign up',
                                  style: theme.textTheme.bodyMedium?.copyWith(
                                      color: theme.primaryColor,
                                      decoration: TextDecoration.underline,
                                      decorationColor: theme.primaryColor
                                  ),
                                )
                            )
                          ],
                        )
                      ],
                    ),
                  )
              )
            ],
          ),
        ),
      )
    );
  }

}

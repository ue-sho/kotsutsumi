import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty({ message: 'ユーザー名は必須です' })
  @MinLength(3, { message: 'ユーザー名は3文字以上で入力してください' })
  @MaxLength(50, { message: 'ユーザー名は50文字以下で入力してください' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'ユーザー名は英数字とアンダースコアのみ使用できます',
  })
  username: string;

  @IsEmail({}, { message: '有効なメールアドレスを入力してください' })
  @MaxLength(255, { message: 'メールアドレスは255文字以下で入力してください' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'パスワードは必須です' })
  @MinLength(8, { message: 'パスワードは8文字以上で入力してください' })
  @MaxLength(128, { message: 'パスワードは128文字以下で入力してください' })
  @Matches(/[A-Z]/, { message: '大文字を1文字以上含めてください' })
  @Matches(/[a-z]/, { message: '小文字を1文字以上含めてください' })
  @Matches(/[0-9]/, { message: '数字を1文字以上含めてください' })
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: '表示名は100文字以下で入力してください' })
  displayName?: string;
}

import { ValidateRule } from "./types";

export const RequireRule: ValidateRule = {
	rule: /.+/,
	match: true,
	message: '필수 입력 항목 입니다.',
};

export const CantContainWhitespace: ValidateRule = {
	rule: /\s/,
	match: false,
	message: '공백을 포함할 수 없습니다.',
};

export const CantStartNumber: ValidateRule = {
	rule: /^\d/,
	match: false,
	message: '숫자로 시작하는 아이디는 사용할 수 없습니다.',
};

export const MinimumLengthLimit = (limit: number) : ValidateRule =>({
	rule: new RegExp(`(.){${limit}}`),
	match: true,
	message: `최소한 ${limit}글자 이상 이어야 합니다.`,
}) 


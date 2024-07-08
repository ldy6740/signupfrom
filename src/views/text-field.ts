import { nextTick } from '../utils';
import { ValidateRule } from '../types';
import template from './text-field.template';
import { RequireRule } from '../constant';

type Props = {
	id: string;
	label: string;
	type: 'text'|'email'|'number';
	placeholder?: string;
	text?: string;
	require: boolean;  //필수조건 여부 확인
}

const DefaultProps: Props = {
	id: '',
	text: '',
	label: 'label',
	type: 'text',
	placeholder: '',
	require: false,
}

export default class TextField {
	private template = template;
	private container: string;
	private data: Props;
	private updated: boolean = false; // 업데이트 여부 (onChange 한번이라도 실행했는지)
	private validateRules: ValidateRule[] = [];

	constructor(container: string, data: Props) {
		this.container = container;
		this.data = {...DefaultProps, ...data }; //default props 와 전달된 data를 병합, 속성이 data에 있으면 해당 속성값으로 변경, 없으면 defaultprops 의 값을 유지

		if (this.data.require) { // 만약 입력값이 필수 값이면 
			this.addValidateRule(RequireRule); //addValidateRule함수를 이용하여 rule을 넣어준다.
		}

		nextTick(this.attachEventHandler);
	}

	private validate = (): ValidateRule | null => {
		const target = this.data.text ? this.data.text.trim() : '';

		const invalidateRules = this.validateRules
			.filter(validateRule => validateRule.rule.test(target) !== validateRule.match);
			// validateRules.rule.test(target)을 통해 결과와 validateRule.match의 값이 동일하지 않는 rule만 모아 새로운 배열로 반환
			// RegExp의 메소드 test를 이용하여 target 문자열을 던저 정규 표현식에 부합한지 확인 결과를 true/false로 반환

		// console.log(invalidateRules);
		return (invalidateRules.length > 0) ? invalidateRules[0] : null;
		// InvalidateRules.length 값이 0보다 클경우 InvalidateRules[0] 요소 반환, 아니라면 null 반환
	}

	private buildData = () => {
		const isInvalid: ValidateRule | null = this.validate();

		if (this.updated) {
			return {
				...this.data,
				updated: this.updated,
				valid: !isInvalid, // validate실행 결과 (반유효성) 검사 결과
				validateMessage: !!isInvalid ? isInvalid.message : ''
			}
		} else {
			return {
				...this.data,
				updated: this.updated,
				valid: true,
				validateMessage: ''
			}
		}
	}

	private onChange = (e: Event) => {
		const { value, id } = e.target as HTMLInputElement;
		// target value, id 가져온다.

		if (id === this.data.id) {  // 만약 id가  this.data.id 동일하면
			this.updated = true; // updated를 true로 바꾸고
			this.data.text = value; // this.data.text에 value를 넣는다.
			this.update(); // this.update() 함수를 실행
		}
	}

	private attachEventHandler = () => {
		document.querySelector(this.container)?.addEventListener('change', this.onChange);
		// container 에 change 이벤트가 발생하면 this.onChange 함수를 실행
	}

	private update = () => {
		const container = document.querySelector(`#field-${this.data.id}`) as HTMLElement; // html element 중 #field-${this.data.id}값을 가진 Element 요소를 넣는다. 
		const docFrag = document.createElement('div'); // div요소를 만들다.

		docFrag.innerHTML = this.template(this.buildData()); // buildData 함수를 실행시켜 반환된 결과를 template으로 전단한다.
		container.innerHTML = docFrag.children[0].innerHTML; //docFrag의 자식 요소중 0번째의 html 요소를 가져와 container 에 innerHTML 이용하여 삽입
	}

	public get name(): string {
		return this.data.id;
	}

	public get value(): string {
		return this.data.text || '';
	}

	public get isValid(): boolean {
		return !this.validate();
	}

	public addValidateRule = (rule:ValidateRule) => {
		this.validateRules.push(rule);
	}

	public render = (append: boolean = false) => {
		const container = document.querySelector(this.container) as HTMLElement;

		if (append) {
			const divFragment = document.createElement('div');
			divFragment.innerHTML = this.template(this.buildData());

			container.appendChild(divFragment.children[0]);
		} else {
			container.innerHTML = this.template(this.buildData());
		}
	}
}
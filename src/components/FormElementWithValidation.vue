<template>
	<ValidationProvider
		class="item"
		:class="[
			item['class'],
			{ disabled: vdisabled() },
			{
				isRequired:
					{ ...rules, ...((customValidation.validate || {})[item['name']] || {}) }
						.required === true,
			},
		]"
		:style="item['style']"
		:ref="`validation-provider-${item['name']}`"
		:vid="item['name']"
		:name="(locale ? locale[item['name']] : '') || item['label']"
		:rules="{ ...rules, ...customValidation.validate[item['name']] }"
		v-slot="{ valid, errors }"
		v-if="vshow()"
	>
		<b-form-group
			:class="`form-group-${item['type']}`"
			:id="`input-group-${item['name']}`"
			:label-for="item['name']"
			:description="item['description']"
			label-class="form-group-label"
		>
			<template v-slot:label>
				{{
					item["type"] != "checkbox" && item["type"] != "radio"
						? (locale && locale.hasOwnProperty(item["name"]) ? locale[item["name"]] : item["label"]) || item["name"]
						: ""
				}}
				<span
					v-if="
						item['type'] != 'checkbox' &&
						item['type'] != 'radio' &&
						{ ...rules, ...((customValidation.validate || {})[item['name']] || {}) }
							.required === true
					"
					class="text-danger"
					>*</span
				>
			</template>

			<!-- {{item['type']}} -->

			<b-form-input
				v-if="item['type'] == 'text' || item['type'] == 'email'"
				v-bind="item_attr"
				:state="errors[0] ? false : valid ? true : null"
				v-model="innerValue"
				v-on="item.handlers||{}"
			>
			</b-form-input>

			<b-form-input
				v-if="item['type'] == 'number'"
				v-bind="item_attr"
				:state="errors[0] ? false : valid ? true : null"
				v-model="innerValue"
				v-amountFormat
				v-on="item.handlers||{}"
			>
			</b-form-input>

			<b-form-input
				v-if="item['type'] == 'numericOnly'"
				type="text"
				v-bind="item_attr"
				:state="errors[0] ? false : valid ? true : null"
				v-model="innerValue"
				v-on="item.handlers||{}"
				v-numericOnly
			>
			</b-form-input>

			<b-form-input
				v-if="item['type'] == 'day'"
				v-bind="item_attr"
				:state="errors[0] ? false : valid ? true : null"
				v-model="innerValue"
				v-on="item.handlers||{}"
				v-dayFormat
			>
			</b-form-input>
			<date-picker
				v-if="item['type'] == 'datetime' || item['type'] == 'date'"
				v-bind="item_attr"
				:state="errors[0] ? false : valid ? true : null"
				:class="{ 'is-invalid': !!errors.length }"
				:type="item['type']"
				v-model="innerValue"
				v-on="item.handlers||{}"
				input-class="form-control"
				:format="
					item['type'] == 'datetime' ? $globalDateFormatLong : $globalDateFormatShort
				"
				:value-type="
					item['type'] == 'datetime' ? $globalDateFormatLong : $globalDateFormatShort
				"
				:disabled-date="
					item['futureDates'] == null ? function () {} : disabledDates
				"
				:append-to-body="filterView==true ? false : true"
			>
			</date-picker>

			<date-picker
				v-if="item['type'] == 'time12' || item['type'] == 'time24'"
				input-class="form-control"
				v-model="innerValue"
				v-on="item.handlers||{}"
				v-bind="item"
				type="time"
				:placeholder="placeholder_str"
			></date-picker>

			<date-picker
				v-if="item['type'] == 'time'"
				v-bind="item_attr"
				:state="errors[0] ? false : valid ? true : null"
				:class="{ 'is-invalid': !!errors.length }"
				:type="item['type']"
				v-model="innerValue"
				v-on="item.handlers||{}"
				input-class="form-control"
				:format="$globalTimeFormat"
				:value-type="$globalTimeFormat"
				:placeholder="placeholder_str"
			>
				<template slot="icon-calendar">
					<b-icon-clock />
				</template>
			</date-picker>

			<!-- :reduce="a => a[item['ds-code']] || a['code']" -->
			<!-- :options="(dataset) ? dataset : []" -->
			<!-- if no dataset pass from api then item.ds will call  -->

			<!-- :item-value="item['ds-code']"
        return-object -->
			<!-- :reduce="a =>   a[item['ds-code']] ? ( a[item['ds-code']] + ( item['ds-group'] ? ` ${a[item['ds-group']]}` : '' ) ) : a['code'] " -->
		
			<v-select
				v-if="item['type'] == 'select'"
				v-bind="item_attr"
				:state="errors[0] ? false : valid ? true : null"
				v-model="innerValue"
				v-on="item.handlers||{}"
				:class="{ 'is-invalid': !!errors.length }"
				:label="item['ds-name'] || 'name'"
				:options="item['static'] == true ? item.ds : uniqueDatasetValues || []"
				:title="getTitle"
				:reduce="
					(a) => (a[item['ds-code']] ? a[item['ds-code']].toString() : a['code'])
				"
			>
			</v-select>

			<base-remote-select
				v-if="item['type'] == 'remote-select'"
				v-bind="item"
				:state="errors[0] ? false : valid ? true : null"
				v-model="innerValue"
				v-on="item.handlers||{}"
				:class="{ 'is-invalid': !!errors.length }"
				:filterView="filterView"
			>
			</base-remote-select>

			<b-form-checkbox
				v-if="item['type'] == 'checkbox'"
				v-bind="item_attr"
				:state="errors[0] ? false : valid ? true : null"
				:value="item['checked-val'] || 'Y'"
				:unchecked-value="item['unchecked-val'] || 'N'"
				v-model="innerValue"
				v-on="item.handlers||{}"
			>
				{{ (locale ? locale[item["name"]] : "") || item["label"] }}
			</b-form-checkbox>

			<b-form-radio
				v-if="item['type'] == 'radio'"
				v-bind="item_attr"
				:state="errors[0] ? false : valid ? true : null"
				:value="item['checked-val']"
				v-model="innerValue"
				v-on="item.handlers||{}"
			>
				{{ (locale ? locale[item["name"]] : "") || item["label"] }}
			</b-form-radio>

			<b-form-checkbox-group
				v-if="item['type'] == 'checkbox-group'"
				v-bind="item_attr"
				:state="errors[0] ? false : valid ? true : null"
				v-model="innerValue"
				v-on="item.handlers||{}"
			>
				<b-form-checkbox
					:value="li.value || li"
					v-for="(li, index) in dataset"
					:key="`${item['name']}_${index}`"
				>
					{{ li.text || li }}
				</b-form-checkbox>
			</b-form-checkbox-group>

			<b-form-radio-group
				v-if="item['type'] == 'radio'"
				v-bind="item_attr"
				:state="errors[0] ? false : valid ? true : null"
				v-model="innerValue"
				v-on="item.handlers||{}"
			>
				<b-form-radio
					:value="li"
					v-for="(li, index) in dataset"
					:key="`${item['name']}_${index}`"
				>
					{{ li }}
				</b-form-radio>
			</b-form-radio-group>

			<b-form-textarea
				v-if="item['type'] == 'textarea'"
				v-bind="item_attr"
				:state="errors[0] ? false : valid ? true : null"
				v-model="innerValue"
				v-on="item.handlers||{}"
			>
				<slot />
			</b-form-textarea>

			<b-form-file
				v-if="item['type'] == 'filefield'"
				v-bind="item_attr"
				:state="errors[0] ? false : valid ? true : null"
				v-model="innerValue"
				v-on="item.handlers||{}"
			></b-form-file>

			<!-- {{item.rules.max[0]}}
			{{innerValue}} -->
			<div class="character-count"
			 v-if="
			 !errors[0] && 
			 maxCharacters &&
			 (
				 item['type'] == 'text' ||
				item['type'] == 'number' ||
				item['type'] == 'numericOnly' ||
				item['type'] == 'textarea' ||
				item['type'] == 'email'
			 ) 
			 ">
				{{maxCharacters}} characters left	
			</div>

			<b-form-invalid-feedback>{{ errors[0] }}</b-form-invalid-feedback>
		</b-form-group>
	</ValidationProvider>
</template>


<script>
import { ValidationProvider } from "vee-validate";

export default {
	components: {
		ValidationProvider,
	},
	props: {
		item: {
			type: [Object, String],
			default: "",
		},
		// must be included in props
		value: {
			type: null,
		},
		locale: {
			type: null,
		},
		dataset: {
			type: [Array, String],
			default: "",
		},
		customValidation: {
			type: Object,
			default: function () {
				return {
					hide: {},
					disabled: {},
					validate: {},
				};
			},
		},
		filterView:{
			type: Boolean,
			default: false
		},
		isDatalist:{
			type: Boolean,
			default: false,
		},
		formControlSize:{
			type: String,
		}
	},

	data() {
		const val = this.item.type == "checkbox-group" ? [] : this.value;
		return {
			innerValue: val,
			getTitle: "",
		};
	},
	computed: {
		maxCharacters(){
			if(this.innerValue &&  this.item.rules && this.item.rules.max && this.item.rules.max[0] >= this.innerValue.length){
				return  this.item.rules.max[0] -  this.innerValue.length
			}
			else{
				return ""
			}
			// `${innerValue && item.rules && item.rules.max &&  item.rules.max[0] >= innerValue.length ? item.rules.max[0] -  innerValue.length : 0} Character Left` 
		},
		item_attr() {
			return {
				name: this.item["name"],
				// id:this.item['name'],
				placeholder: this.placeholder_str,
				ref: `el_${this.item["name"]}`,
				stacked: this.item["stacked"],
				multiple: this.item["multiple"],
				disabled: this.vdisabled(),
				tabindex: this.item.tabindex,
				size: this.formControlSize
			};
		},
		placeholder_str(){
			let placeholder_str = (this.locale && this.locale.hasOwnProperty(this.item["name"]))
					? `${this.locale[this.item["label"]]}`
					: this.item["placeholder"] || this.item["label"]

			let str = 
			this.item.type == "select" || 
			this.item.type == "remote-select" ||
			this.item.type == "date" ||
			this.item.type == "datetime" ||
			this.item.type == "time12" ||
			this.item.type == "time24" ||
			this.item.type == "time" 
			? `${placeholder_str}` : `${placeholder_str}`;

			return 	str
		},
		rules() {
			if (this.item["type"] == "number") {
				return { numeric_comma: true, ...this.item["rules"] };
			} else if (this.item["type"] == "numericOnly") {
				return { numeric: true, ...this.item["rules"] };
			} else {
				return { ...this.item["rules"] };
			}
		},
		uniqueDatasetValues(){
			// return this.dataset;

			if(this.dataset.length && this.item.isDatalist ==false && !this.filterView){
				const arrayUniqueByKey = [...new Map(this.dataset.map(a => [a[this.item["ds-code"]], a])).values()];
				const authoriseFilter = arrayUniqueByKey.filter(b => b.AUTHORIZATION_STATUS == "1");
				return authoriseFilter
			}
			else{
				return this.dataset || []
			}
		}
	},
	watch: {
		// Handles internal model changes.
		innerValue(newVal) {
			this.$emit("input", newVal || "");

			if (this.item.type == "select" && this.dataset && newVal) {
				this.innerValue = newVal.toString();
				const _filterd = this.dataset.filter((i) => {
					if (i[this.item["ds-code"]] == newVal) {
						return i[this.item["ds-code"]] == newVal;
					}
				});

				if (_filterd && _filterd[0])
					this.getTitle = _filterd ? _filterd[0][this.item["ds-name"]] : [];
			}

			if (this.item["ds-group"] && this.dataset) {
				this.dataset.filter((i) => {
					if (i[this.item["ds-code"]] == this.innerValue) {
						this.innerValue = this.innerValue + " " + i[this.item["ds-group"]];
					}
				});
			}
		},
		// Handles external model changes.
		value(newVal) {
			this.innerValue = newVal;
		},
	},
	created() {
		if (this.value) {
			this.innerValue = this.value;
		}
		if (this.item.value) {
			this.innerValue = this.item.value;
		}

		/*if (
			(this.item.type == "date" || this.item.type == "datetime") &&
			!this.innerValue
		) {
			this.innerValue = this.$today();
		}
		if (this.item.type == "time") {
			this.innerValue = this.$currentTime();
		}*/

		if (this.item.type == "checkbox") {
			this.innerValue = this.item.value || "N";
		}
	},
	methods: {
		vshow() {
			let isVisible = ((this.customValidation || {}).hide || {})[this.item.name];
			return this.$isUndef(isVisible) ? true : isVisible;
		},
		vdisabled() {
			let isDisabled = ((this.customValidation || {}).disabled || {})[
				this.item.name
			] || this.item["disabled"];
			return this.$isUndef(isDisabled) ? false : isDisabled;
		},
		disabledDates(date) {
			return this.item["futureDates"] == true
				? this.futureDatesEnable(date)
				: this.futureDatesDisable(date);
		},
		futureDatesDisable: (date) => date >= new Date(),
		futureDatesEnable: (date) => date <= new Date(),
	},
};
</script>

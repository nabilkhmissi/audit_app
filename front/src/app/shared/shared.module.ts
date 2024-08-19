import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { CheckboxModule } from "primeng/checkbox";
import { ChipModule } from "primeng/chip";
import { ChipsModule } from "primeng/chips";
import { ColorPickerModule } from "primeng/colorpicker";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DropdownModule } from "primeng/dropdown";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { InputSwitchModule } from "primeng/inputswitch";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { KnobModule } from "primeng/knob";
import { ListboxModule } from "primeng/listbox";
import { MultiSelectModule } from "primeng/multiselect";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { PasswordModule } from "primeng/password";
import { RadioButtonModule } from "primeng/radiobutton";
import { RatingModule } from "primeng/rating";
import { SelectButtonModule } from "primeng/selectbutton";
import { SliderModule } from "primeng/slider";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { ToggleButtonModule } from "primeng/togglebutton";
import { CustomConfirmDialogComponent } from "./dialogs/custom-confirm-dialog/custom-confirm-dialog.component";
import { DialogModule } from "primeng/dialog";
import { UserInfosDialogComponent } from "./dialogs/user-infos-dialog/user-infos-dialog.component";
import { AuditInfosDialogComponent } from "./dialogs/audit-infos-dialog/audit-infos-dialog.component";
import { AvatarModule } from "primeng/avatar";
import { AvatarGroupModule } from "primeng/avatargroup";
import { FieldsetModule } from "primeng/fieldset";
import { EditUserDialogComponent } from "./dialogs/edit-user-dialog/edit-user-dialog.component";
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { EditAuditDialogComponent } from "./dialogs/edit-audit-dialog/edit-audit-dialog.component";
import { TooltipModule } from "primeng/tooltip";



@NgModule({
    declarations : [
		CustomConfirmDialogComponent,
	],
    imports : [
		ConfirmDialogModule,
		UserInfosDialogComponent,
		AuditInfosDialogComponent,
		EditUserDialogComponent,
		ProgressSpinnerModule,
		EditAuditDialogComponent
	],
    exports : [
		CommonModule,
		FormsModule,
		AutoCompleteModule,
		CalendarModule,
		ChipsModule,
		DropdownModule,
		InputMaskModule,
		InputNumberModule,
		ColorPickerModule,
		CascadeSelectModule,
		MultiSelectModule,
		ToggleButtonModule,
		SliderModule,
		InputTextareaModule,
		RadioButtonModule,
		InputTextModule,
		RatingModule,
		ChipModule,
		KnobModule,
		InputSwitchModule,
		ListboxModule,
		SelectButtonModule,
		CheckboxModule,
		ButtonModule,
		InputGroupModule,
		InputGroupAddonModule,
		TableModule,
		ToastModule,
		PasswordModule,
		ConfirmDialogModule,
		CommonModule,
		ToastModule,
		FormsModule,
		InputTextModule,
		ButtonModule,
		TableModule,
		ConfirmDialogModule,
		OverlayPanelModule,
		CustomConfirmDialogComponent,
		DialogModule,
		UserInfosDialogComponent,
		AuditInfosDialogComponent,
		AvatarModule,
		AvatarGroupModule,
		ReactiveFormsModule,
		FieldsetModule,
		EditUserDialogComponent,
		ProgressSpinnerModule,
		EditAuditDialogComponent,
		TooltipModule
	],
    providers : [
		ConfirmationService,
		MessageService
	],
})
export class SharedModule {

}
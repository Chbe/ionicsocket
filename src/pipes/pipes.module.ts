import { NgModule } from '@angular/core';
import { UsernamePipe } from './username/username';
@NgModule({
	declarations: [UsernamePipe],
	imports: [],
	exports: [UsernamePipe]
})
export class PipesModule {}

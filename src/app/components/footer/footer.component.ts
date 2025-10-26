import { Component } from '@angular/core';
import packageInfo from '../../../../package.json';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class Footer {
  developerEmail = `${packageInfo.author.email}`;
  developerName = `${packageInfo.author.name}`;
  url = `${packageInfo.author.url}`;
  version = packageInfo.version;
}

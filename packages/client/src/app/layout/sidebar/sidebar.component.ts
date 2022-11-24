import { Dialog } from '@angular/cdk/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { SidebarService } from './sidebar.service';
import { UsuarioDialogComponent } from './usuario-dialog/usuario-dialog.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  showUserMenu = false;
  usuario: Usuario = { nombre: '', apellido: '', username: '', id: 0 };

  constructor(
    public sidebarService: SidebarService,
    private authService: AuthService,
    private usuariosService: UsuariosService,
    private dialog: Dialog
  ) {}

  ngOnInit(): void {
    document.addEventListener('click', this.onCloseUserMenu);
    this.usuariosService.profile().subscribe((usuario) => {
      if (usuario) {
        this.usuario = usuario;
      }
    });
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  onCloseUserMenu = (ev: MouseEvent) => {
    const isUserMenu = !!(ev.target as HTMLElement).closest('#user-menu');
    const isBtnUserMenu = !!(ev.target as HTMLElement).closest(
      '#btn-user-menu'
    );
    if (this.sidebarService.collapsed) {
      const isAvatarUserMenu = !!(ev.target as HTMLElement).closest(
        '#avatar-user-menu'
      );
      if (!isAvatarUserMenu && !isUserMenu) {
        this.showUserMenu = false;
      }
    } else {
      if (!isUserMenu && !isBtnUserMenu) {
        this.showUserMenu = false;
      }
    }
  };

  logout() {
    this.authService.logout();
  }

  openUsuarioDialog() {
    this.dialog
      .open<Usuario>(UsuarioDialogComponent)
      .closed.subscribe((usuario) => {
        if (usuario) {
          this.usuario = usuario;
        }
      });
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onCloseUserMenu);
  }
}
